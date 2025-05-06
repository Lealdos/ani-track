import { Anime, streaming } from '@/types/anime'
import { removeDuplicates } from './utils'
import { API_BASE_URL } from '@/config/const'
import { paginationProps } from '@/types/pageInfo'

const API_RATE_LIMIT_DELAY = 1250 // Delay in milliseconds for rate limiting (1/3 second)

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Rate limiting helper - Jikan API has a limit of 3 requests per second
export async function fetchWithRateLimit(url: string) {
    try {
        const response = await fetch(url)

        if (response.status === 429) {
            //'Rate limit reached, waiting for 1 seconds...',
            await delay(API_RATE_LIMIT_DELAY)
            return await fetchWithRateLimit(url)
        }
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        console.error('Error fetching from Jikan API:', error)
        throw error
    }
}

export async function FetchBrowsersAnime(
    query?: string,
    page: number = 1
): Promise<{ animes: Anime[]; pagination: paginationProps }> {
    if (query) {
        try {
            console.log('query', query)
            console.log('page', page)
            console.log(
                `${API_BASE_URL}/anime?${query}&page=${page}&limit=${15}&sfw`
            )
            const data = await fetchWithRateLimit(
                `${API_BASE_URL}/anime?${query}&page=${page}&limit=${15}&sfw`
            )
            const animeData = {
                animes: removeDuplicates(data.data),
                pagination: data.pagination as paginationProps,
            }
            return animeData
        } catch (error) {
            console.error('Error fetching animes:', error)
            throw error as Error
        }
    }
    try {
        const data = await fetchWithRateLimit(
            `${API_BASE_URL}/anime?page=${page}&limit=${15}&sfw`
        )
        const animeData = {
            animes: removeDuplicates(data.data),
            pagination: data.pagination as paginationProps,
        }
        return animeData
    } catch (error) {
        console.error('Error fetching animes:', error)
        throw error as Error
    }
}

export async function getSeasonalAnime(): Promise<Anime[]> {
    try {
        const data = await fetchWithRateLimit(`${API_BASE_URL}/seasons/now`)
        const seasonalAnime = data.data
        return removeDuplicates(seasonalAnime).filter(
            (anime) => anime.status === 'Currently Airing'
        )
    } catch (error) {
        console.error('Error fetching seasonal anime:', error)
        return []
    }
}

export async function getTopAnime(): Promise<Anime[]> {
    try {
        const topAnimeList = await fetchWithRateLimit(
            `${API_BASE_URL}/top/anime?limit=15`
        )
        return topAnimeList.data
    } catch (error) {
        console.error('Error fetching top anime:', error)
        return []
    }
}

export async function getAnimeByGenre(genreId: number): Promise<Anime[]> {
    try {
        const AnimeByGenre = await fetchWithRateLimit(
            `${API_BASE_URL}/anime?genres=${genreId}&limit=10`
        )
        return await AnimeByGenre.data
    } catch (error) {
        console.error(`Error fetching anime for genre ${genreId}:`, error)
        return []
    }
}

export async function getAnimeById(id: number): Promise<Anime | null> {
    try {
        const data = await fetchWithRateLimit(
            `${API_BASE_URL}/anime/${id}/full`
        )
        return data.data
    } catch (error) {
        console.error(`Error fetching anime ${id}:`, error)
        return null
    }
}

/////////////////////////////////////////////////////////////

// Get anime episodes
export async function getAnimeEpisodes(id: number, page = 1) {
    const data = await fetchWithRateLimit(
        `${API_BASE_URL}/anime/${id}/episodes?page=${page}`
    )
    return data
}

// Get anime characters
export async function getAnimeCharacters(id: number) {
    const data = await fetchWithRateLimit(
        `${API_BASE_URL}/anime/${id}/characters`
    )
    return data.data
}

// Get anime recommendations
export async function getAnimeRecommendations(id: number) {
    const data = await fetchWithRateLimit(
        `${API_BASE_URL}/anime/${id}/recommendations`
    )
    return data.data
}

// Get all genres
export async function getGenres() {
    const data = await fetchWithRateLimit(`${API_BASE_URL}/genres/anime`)
    return data.data
}

// Helper function to format streaming platforms
export function formatStreamingPlatforms(streamingLinks: streaming[] = []) {
    if (!streamingLinks || streamingLinks.length === 0) {
        return []
    }

    return streamingLinks.map((link) => {
        // Extract platform name from URL
        const name = link.name
        let logo = name.charAt(0).toUpperCase()

        // Assign colors based on common streaming platforms
        let color = ''
        if (name.toLowerCase().includes('crunchyroll')) {
            color = 'bg-orange-600'
            logo = 'C'
        } else if (name.toLowerCase().includes('netflix')) {
            color = 'bg-red-600'
            logo = 'N'
        } else if (name.toLowerCase().includes('hulu')) {
            color = 'bg-green-600'
            logo = 'H'
        } else if (name.toLowerCase().includes('amazon')) {
            color = 'bg-blue-600'
            logo = 'A'
        } else if (name.toLowerCase().includes('funimation')) {
            color = 'bg-purple-600'
            logo = 'F'
        } else {
            color = 'bg-blue-800'
        }

        return {
            name,
            logo,
            url: link.url,
            color,
            subscription: 'Subscription required',
            price: 'Varies by region',
        }
    })
}
