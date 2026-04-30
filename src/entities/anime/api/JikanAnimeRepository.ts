import type { IAnimeRepository } from './IAnimeRepository'
import type {
    Anime,
    Episode,
    Genre,
    AnimeCharacter,
    Recommendation,
    ScheduleDay,
} from '../models'
import type { PaginationInfo } from '@/types/pageInfo'
import type {
    JikanAnime,
    JikanEpisode,
    JikanGenre,
    JikanRecommendation,
    JikanCharacterDataItem,
} from './jikanTypes'
import {
    toAnime,
    toEpisode,
    toGenre,
    toRecommendation,
    toCharacter,
} from './mappers'
import { DAY, WEEK, DAYS15, MONTH } from './utils'
import { API_BASE_URL } from '@/config/const'

const RATE_LIMIT_DELAY = 1000
const MAX_RETRIES = 3

type JikanResponse<T> = { data: T; pagination?: PaginationInfo }

async function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchWithRateLimit<T>(
    url: string,
    options: RequestInit = {},
    retries = 0
): Promise<T> {
    const response = await fetch(url, options)
    if (response.status === 429) {
        await delay(RATE_LIMIT_DELAY)
        return fetchWithRateLimit<T>(url, options, retries)
    }
    if (response.status >= 500 && retries < MAX_RETRIES) {
        await delay(RATE_LIMIT_DELAY)
        return fetchWithRateLimit<T>(url, options, retries + 1)
    }
    if (!response.ok) {
        throw new Error(`Jikan API error: ${response.status} ${response.statusText}`)
    }
    return response.json()
}

function deduplicateById(animes: JikanAnime[]): JikanAnime[] {
    const seen = new Set<string>()
    return animes.filter((a) => {
        const key = String(a.mal_id)
        if (seen.has(key)) return false
        seen.add(key)
        return true
    })
}

class JikanAnimeRepository implements IAnimeRepository {
    private readonly baseUrl = API_BASE_URL

    async browse(
        query?: string
    ): Promise<{ animes: Anime[]; pagination: PaginationInfo }> {
        const url = query
            ? `${this.baseUrl}/anime?${query}&sfw`
            : `${this.baseUrl}/anime?sfw`
        const { data, pagination } =
            await fetchWithRateLimit<JikanResponse<JikanAnime[]>>(url)
        return {
            animes: deduplicateById(data).map(toAnime),
            pagination: pagination ?? { current_page: 1, has_next_page: false },
        }
    }

    async findById(id: number): Promise<Anime | null> {
        try {
            const { data } = await fetchWithRateLimit<
                JikanResponse<JikanAnime>
            >(`${this.baseUrl}/anime/${id}/full`, {
                next: { revalidate: DAY },
            } as RequestInit)
            return toAnime(data)
        } catch (error) {
            console.error(`Error fetching anime ${id}:`, error)
            return null
        }
    }

    async findTop(): Promise<Anime[]> {
        try {
            const { data } = await fetchWithRateLimit<
                JikanResponse<JikanAnime[]>
            >(`${this.baseUrl}/top/anime?sfw&limit=20`, {
                next: { revalidate: WEEK },
            } as RequestInit)
            return data.toSorted((a, b) => a.rank - b.rank).map(toAnime)
        } catch (error) {
            console.error('Error fetching top anime:', error)
            return []
        }
    }

    async findSeasonal(): Promise<Anime[]> {
        try {
            const { data } = await fetchWithRateLimit<
                JikanResponse<JikanAnime[]>
            >(`${this.baseUrl}/seasons/now?continuing&unapproved`, {
                next: { revalidate: DAY },
            } as RequestInit)
            return deduplicateById(data)
                .filter((a) => a.status === 'Currently Airing')
                .map(toAnime)
        } catch (error) {
            console.error('Error fetching seasonal anime:', error)
            return []
        }
    }

    async findByGenre(genreId: number): Promise<Anime[]> {
        try {
            const { data } = await fetchWithRateLimit<
                JikanResponse<JikanAnime[]>
            >(`${this.baseUrl}/anime?genres=${genreId}&limit=10`, {
                next: { revalidate: DAYS15 },
            } as RequestInit)
            return data.map(toAnime)
        } catch (error) {
            console.error(`Error fetching anime for genre ${genreId}:`, error)
            return []
        }
    }

    async findAiringByDay(day: ScheduleDay): Promise<Anime[]> {
        try {
            const { data } = await fetchWithRateLimit<
                JikanResponse<JikanAnime[]>
            >(`${this.baseUrl}/schedules?filter=${day}&sfw`)
            return deduplicateById(
                data
                    .filter(
                        (a) =>
                            a.broadcast?.day?.toLowerCase().includes(day) &&
                            (a.duration !== 'Unknown' || a.duration)
                    )
                    .toSorted((a, b) => a.rank - b.rank)
            ).map(toAnime)
        } catch (error) {
            console.error('Error fetching airing anime:', error)
            return []
        }
    }

    async findEpisodes(
        id: number,
        page = 1
    ): Promise<{ episodes: Episode[]; pagination: PaginationInfo }> {
        try {
            const { data, pagination } = await fetchWithRateLimit<
                JikanResponse<JikanEpisode[]>
            >(`${this.baseUrl}/anime/${id}/episodes?page=${page}`, {
                next: { revalidate: WEEK },
            } as RequestInit)
            return {
                episodes: data.map(toEpisode),
                pagination: pagination ?? {
                    current_page: page,
                    has_next_page: false,
                },
            }
        } catch (error) {
            console.error(`Error fetching episodes for anime ${id}:`, error)
            return {
                episodes: [],
                pagination: {
                    current_page: 1,
                    last_visible_page: 0,
                    has_next_page: false,
                },
            }
        }
    }

    async findCharacters(id: number): Promise<AnimeCharacter[]> {
        try {
            const { data } = await fetchWithRateLimit<
                JikanResponse<JikanCharacterDataItem[]>
            >(`${this.baseUrl}/anime/${id}/characters`)
            return data.map(toCharacter)
        } catch (error) {
            console.error(`Error fetching characters for anime ${id}:`, error)
            return []
        }
    }

    async findRecommendations(id: number): Promise<Recommendation[]> {
        try {
            const { data } = await fetchWithRateLimit<
                JikanResponse<JikanRecommendation[]>
            >(`${this.baseUrl}/anime/${id}/recommendations`, {
                next: { revalidate: DAYS15 },
            } as RequestInit)
            return data.map(toRecommendation)
        } catch (error) {
            console.error(
                `Error fetching recommendations for anime ${id}:`,
                error
            )
            return []
        }
    }

    async findGenres(): Promise<Genre[]> {
        try {
            const { data } = await fetchWithRateLimit<
                JikanResponse<JikanGenre[]>
            >(`${this.baseUrl}/genres/anime`, {
                next: { revalidate: MONTH },
            } as RequestInit)
            return data.map(toGenre)
        } catch (error) {
            console.error('Error fetching genres:', error)
            return []
        }
    }

}

export const animeRepository: IAnimeRepository = new JikanAnimeRepository()
