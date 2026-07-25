import type { IAnimeRepository } from '../IAnimeRepository'

import type {
    Anime,
    Episode,
    Genre,
    AnimeCharacter,
    Recommendation,
    ScheduleDay,
} from '@/entities/anime/models'
import type { PaginationInfo } from '@/types/pageInfo'
import type {
    AniListMedia,
    AniListPageInfo,
    AniListCharacterEdge,
    AniListRecommendationNode,
    AniListStreamingEpisode,
    AniListAiringSchedule,
    HomeDataResult,
} from './anilistTypes'
import {
    toAnimeFromAniList,
    toCharacterFromAniList,
    toRecommendationFromAniList,
    toEpisodeFromStreaming,
    toGenreFromAniList,
    genreIdToName,
    getCurrentSeason,
    getDayBounds,
} from './anilistMappers'
import { HOUR, DAY, WEEK, DAYS15, MONTH } from '../utils'
import {
    BROWSE_QUERY,
    FIND_BY_ID_QUERY,
    ANIME_DETAIL_QUERY,
    GET_HOME_DATA_QUERY,
    TOP_ANIME_QUERY,
    SEASONAL_QUERY,
    BY_GENRE_QUERY,
    AIRING_SCHEDULE_QUERY,
    CHARACTERS_QUERY,
    RECOMMENDATIONS_QUERY,
    STREAMING_EPISODES_QUERY,
    GENRES_QUERY,
} from './anilistQueries'

const ANILIST_API_URL = 'https://graphql.anilist.co'
const RATE_LIMIT_DELAY = 1000
const MAX_RETRIES = 3

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

async function anilistFetch<T>(
    query: string,
    variables?: Record<string, unknown>,
    options: { revalidate?: number } = {},
    retries = 0
): Promise<T> {
    const init = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({ query, variables }),
        ...(options.revalidate !== undefined
            ? { next: { revalidate: options.revalidate } }
            : {}),
    } as RequestInit

    const response = await fetch(ANILIST_API_URL, init)

    if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After')
        await delay(
            retryAfter ? Number.parseInt(retryAfter) * 1000 : RATE_LIMIT_DELAY
        )
        return anilistFetch<T>(query, variables, options, retries)
    }

    if (response.status >= 500 && retries < MAX_RETRIES) {
        await delay(RATE_LIMIT_DELAY)
        return anilistFetch<T>(query, variables, options, retries + 1)
    }

    if (!response.ok) {
        throw new Error(
            `AniList API error: ${response.status} ${response.statusText}`
        )
    }

    const json = await response.json()

    if (json.errors?.length) {
        throw new Error(`AniList GraphQL error: ${json.errors[0].message}`)
    }

    return json.data as T
}

function toPaginationInfo(pageInfo: AniListPageInfo): PaginationInfo {
    return {
        current_page: pageInfo.currentPage,
        has_next_page: pageInfo.hasNextPage,
        last_visible_page: pageInfo.lastPage,
    }
}

class AniListAnimeRepository implements IAnimeRepository {
    async browse(
        query?: string
    ): Promise<{ animes: Anime[]; pagination: PaginationInfo }> {
        const variables: Record<string, unknown> = {
            page: 1,
            perPage: 25,
            isAdult: false,
            sort: ['POPULARITY_DESC'],
        }

        if (query) {
            const params = new URLSearchParams(query)

            const search = params.get('q') ?? params.get('query')
            if (search) {
                variables.search = search
                // Let AniList rank by relevance when the user searches by text.
                variables.sort = ['SEARCH_MATCH']
            }

            const page = params.get('page')
            if (page) variables.page = Number.parseInt(page)

            const limit = params.get('limit')
            // AniList caps perPage at 50; anything higher returns a GraphQL error.
            if (limit)
                variables.perPage = Math.min(
                    50,
                    Math.max(1, Number.parseInt(limit))
                )

            const genres = params.get('genres')
            if (genres) {
                const genreNames = genres
                    .split(',')
                    .map((id) => genreIdToName(Number.parseInt(id)))
                    .filter(Boolean)
                if (genreNames.length) variables.genre_in = genreNames
            }

            const status = params.get('status')
            if (status) {
                const statusMap: Record<string, string> = {
                    airing: 'RELEASING',
                    complete: 'FINISHED',
                    upcoming: 'NOT_YET_RELEASED',
                }
                if (statusMap[status]) variables.status = statusMap[status]
            }

            const orderBy = params.get('order_by')
            const sort = params.get('sort')
            if (orderBy) {
                const dir = sort === 'asc' ? '' : '_DESC'
                const sortMap: Record<string, string> = {
                    score: `SCORE${dir}`,
                    title: `TITLE_ROMAJI${dir}`,
                    rank: sort === 'asc' ? 'SCORE_DESC' : 'SCORE',
                    popularity: `POPULARITY${dir}`,
                    start_date: `START_DATE${dir}`,
                    episodes: `EPISODES${dir}`,
                }
                if (sortMap[orderBy]) variables.sort = [sortMap[orderBy]]
            }

            const type = params.get('type')
            if (type) {
                const formatMap: Record<string, string> = {
                    tv: 'TV',
                    movie: 'MOVIE',
                    ova: 'OVA',
                    special: 'SPECIAL',
                    ona: 'ONA',
                    music: 'MUSIC',
                }
                if (formatMap[type]) variables.format = formatMap[type]
            }
        }

        try {
            const result = await anilistFetch<{
                Page: {
                    pageInfo: AniListPageInfo
                    media: AniListMedia[]
                }
            }>(BROWSE_QUERY, variables)

            return {
                animes: result.Page.media.map(toAnimeFromAniList),
                pagination: toPaginationInfo(result.Page.pageInfo),
            }
        } catch (error) {
            console.error('Error browsing anime:', error)
            return {
                animes: [],
                pagination: { current_page: 1, has_next_page: false },
            }
        }
    }

    async findById(id: number): Promise<Anime | null> {
        try {
            const result = await anilistFetch<{ Media: AniListMedia }>(
                FIND_BY_ID_QUERY,
                { id },
                { revalidate: DAY }
            )
            return toAnimeFromAniList(result.Media)
        } catch (error) {
            console.error(`Error fetching anime ${id}:`, error)
            return null
        }
    }

    async findTop(): Promise<Anime[]> {
        try {
            const result = await anilistFetch<{
                Page: {
                    pageInfo: AniListPageInfo
                    media: AniListMedia[]
                }
            }>(TOP_ANIME_QUERY, { page: 1, perPage: 20 }, { revalidate: WEEK })
            return result.Page.media.map(toAnimeFromAniList)
        } catch (error) {
            console.error('Error fetching top anime:', error)
            return []
        }
    }

    async findSeasonal(): Promise<Anime[]> {
        try {
            const { season, year } = getCurrentSeason()
            const result = await anilistFetch<{
                Page: {
                    pageInfo: AniListPageInfo
                    media: AniListMedia[]
                }
            }>(
                SEASONAL_QUERY,
                { season, seasonYear: year, page: 1, perPage: 50 },
                { revalidate: DAY }
            )
            return result.Page.media.map(toAnimeFromAniList)
        } catch (error) {
            console.error('Error fetching seasonal anime:', error)
            return []
        }
    }

    async findByGenre(genreId: number): Promise<Anime[]> {
        try {
            const genreName = genreIdToName(genreId)
            if (!genreName) return []

            const result = await anilistFetch<{
                Page: {
                    pageInfo: AniListPageInfo
                    media: AniListMedia[]
                }
            }>(
                BY_GENRE_QUERY,
                { genre: genreName, page: 1, perPage: 10 },
                { revalidate: DAYS15 }
            )
            return result.Page.media.map(toAnimeFromAniList)
        } catch (error) {
            console.error(`Error fetching anime for genre ${genreId}:`, error)
            return []
        }
    }

    async findAiringByDay(day: ScheduleDay): Promise<Anime[]> {
        try {
            const { start, end } = getDayBounds(day)
            const result = await anilistFetch<{
                Page: {
                    pageInfo: AniListPageInfo
                    airingSchedules: AniListAiringSchedule[]
                }
            }>(AIRING_SCHEDULE_QUERY, {
                airingAtGreater: start,
                airingAtLesser: end,
                page: 1,
                perPage: 50,
            })

            const seen = new Set<number>()
            const uniqueMedia: AniListMedia[] = []
            for (const schedule of result.Page.airingSchedules) {
                if (!seen.has(schedule.media.id)) {
                    seen.add(schedule.media.id)
                    uniqueMedia.push(schedule.media)
                }
            }

            return uniqueMedia.map(toAnimeFromAniList)
        } catch (error) {
            console.error('Error fetching airing anime:', error)
            return []
        }
    }

    async findEpisodes(
        id: number,
        page = 1
    ): Promise<{ episodes: Episode[]; pagination: PaginationInfo }> {
        const PER_PAGE = 100
        try {
            const result = await anilistFetch<{
                Media: {
                    episodes: number | null
                    streamingEpisodes: AniListStreamingEpisode[]
                }
            }>(STREAMING_EPISODES_QUERY, { id }, { revalidate: WEEK })

            const allEpisodes = result.Media.streamingEpisodes.map(
                (episode, index) => toEpisodeFromStreaming(episode, index + 1)
            )
            const start = (page - 1) * PER_PAGE
            const paged = allEpisodes.slice(start, start + PER_PAGE)
            const lastPage = Math.max(
                1,
                Math.ceil(allEpisodes.length / PER_PAGE)
            )

            return {
                episodes: paged,
                pagination: {
                    current_page: page,
                    has_next_page: page < lastPage,
                    last_visible_page: lastPage,
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
            const result = await anilistFetch<{
                Media: {
                    characters: { edges: AniListCharacterEdge[] }
                }
            }>(CHARACTERS_QUERY, { id, page: 1, perPage: 25 })

            return result.Media.characters.edges.map(toCharacterFromAniList)
        } catch (error) {
            console.error(`Error fetching characters for anime ${id}:`, error)
            return []
        }
    }

    async findRecommendations(id: number): Promise<Recommendation[]> {
        try {
            const result = await anilistFetch<{
                Media: {
                    recommendations: { nodes: AniListRecommendationNode[] }
                }
            }>(
                RECOMMENDATIONS_QUERY,
                { id, page: 1, perPage: 25 },
                { revalidate: DAYS15 }
            )

            return result.Media.recommendations.nodes
                .map(toRecommendationFromAniList)
                .filter((r): r is Recommendation => r !== null)
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
            const result = await anilistFetch<{ GenreCollection: string[] }>(
                GENRES_QUERY,
                undefined,
                { revalidate: MONTH }
            )
            return result.GenreCollection.map(toGenreFromAniList)
        } catch (error) {
            console.error('Error fetching genres:', error)
            return []
        }
    }
}

export const anilistAnimeRepository: IAnimeRepository =
    new AniListAnimeRepository()

export async function getHomeData(tag = 'Seinen'): Promise<HomeDataResult> {
    const { season, year } = getCurrentSeason()
    const now = new Date()
    const startOfDay = Math.floor(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) /
            1000
    )
    const endOfDay = startOfDay + 86400

    try {
        return await anilistFetch<HomeDataResult>(
            GET_HOME_DATA_QUERY,
            { season, seasonYear: year, startOfDay, endOfDay, tag },
            { revalidate: HOUR }
        )
    } catch (error) {
        console.error('Error fetching home data:', error)
        return {
            currentSeason: { media: [] },
            airingToday: { airingSchedules: [] },
            topAnime: { media: [] },
            tagAnime: { media: [] },
        }
    }
}

export async function getAnimeDetail(id: number): Promise<{
    anime: Anime | null
    characters: AnimeCharacter[]
    recommendations: Recommendation[]
} | null> {
    try {
        const result = await anilistFetch<{ Media: AniListMedia }>(
            ANIME_DETAIL_QUERY,
            { id },
            { revalidate: DAY }
        )

        const media = result.Media
        return {
            anime: toAnimeFromAniList(media),
            characters: (media.characters?.edges ?? []).map(
                toCharacterFromAniList
            ),
            recommendations: (media.recommendations?.nodes ?? [])
                .map(toRecommendationFromAniList)
                .filter((r): r is Recommendation => r !== null),
        }
    } catch (error) {
        console.error(`Error fetching anime detail ${id}:`, error)
        return null
    }
}
