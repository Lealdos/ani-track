import { Anime, streaming } from '@/types/anime';
import { removeDuplicates } from './utils';

// Jikan API v4 base URL
const API_BASE_URL = 'https://api.jikan.moe/v4';

// Rate limiting helper - Jikan API has a limit of 3 requests per second
// This simple delay helps prevent rate limit errors
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to handle API rate limiting
const fetchWithRetry = async (url: string, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url);

            if (response.status === 429) {
                // Rate limited, wait and retry
                await new Promise((resolve) => setTimeout(resolve, delay));
                continue;
            }

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
};

export async function getAllAnimes(page: number = 1) {
    try {
        const data = await fetchWithRetry(`${API_BASE_URL}/anime?page=${page}`);
        const animes = data;
        return animes;
    } catch (error) {
        console.error('Error fetching animes:', error);
        return [];
    }
}
export async function getSeasonalAnime(): Promise<Anime[]> {
    try {
        const data = await fetchWithRetry(`${API_BASE_URL}/seasons/now`);
        const seasonalAnime = data.data;
        return removeDuplicates(seasonalAnime);
    } catch (error) {
        console.error('Error fetching seasonal anime:', error);
        return [];
    }
}

export async function getTopAnime(): Promise<Anime[]> {
    try {
        const topAnimeList = await fetchWithRetry(
            `${API_BASE_URL}/top/anime?limit=15`
        );
        return topAnimeList.data;
    } catch (error) {
        console.error('Error fetching top anime:', error);
        return [];
    }
}

export async function getAnimeByGenre(genreId: number): Promise<Anime[]> {
    try {
        const AnimeByGenre = await fetchWithRetry(
            `${API_BASE_URL}/anime?genres=${genreId}&limit=10`
        );
        return await AnimeByGenre.data;
    } catch (error) {
        console.error(`Error fetching anime for genre ${genreId}:`, error);
        return [];
    }
}

export async function getAnimeById(id: number): Promise<Anime | null> {
    try {
        const data = await fetchWithRetry(`${API_BASE_URL}/anime/${id}/full`);
        return data.data;
    } catch (error) {
        console.error(`Error fetching anime ${id}:`, error);
        return null;
    }
}

export async function searchAnime(query: string): Promise<Anime[]> {
    try {
        const data = await fetchWithRetry(
            `${API_BASE_URL}/anime?q=${encodeURIComponent(query)}&limit=20`
        );
        return data.data;
    } catch (error) {
        console.error('Error searching anime:', error);
        return [];
    }
}

/////////////////////////////////////////////////////////////

// Fetch with rate limiting
async function fetchWithRateLimit(url: string) {
    try {
        const response = await fetch(url);

        // If we're approaching rate limits, add a delay
        if (response.headers.get('X-RateLimit-Remaining') === '1') {
            await delay(1000);
        }

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching from Jikan API:', error);
        throw error;
    }
}

// // Get top anime (for homepage)
// export async function getTopAnime(limit = 6) {
//     const data = await fetchWithRateLimit(
//         `${API_BASE_URL}/top/anime?limit=${limit}`
//     );
//     return data.data;
// }

// Get seasonal anime (for homepage)
// export async function getSeasonalAnime(limit = 6) {
//     const data = await fetchWithRateLimit(
//         `${API_BASE_URL}/seasons/now?limit=${limit}`
//     );
//     return data.data;
// }

// // Get anime by ID
// export async function getAnimeById(id: number) {
//     const data = await fetchWithRateLimit(`${API_BASE_URL}/anime/${id}/full`);
//     return data.data;
// }

// Get anime episodes
export async function getAnimeEpisodes(id: number, page = 1) {
    const data = await fetchWithRateLimit(
        `${API_BASE_URL}/anime/${id}/episodes?page=${page}`
    );
    return data;
}

// Get anime characters
export async function getAnimeCharacters(id: number) {
    const data = await fetchWithRateLimit(
        `${API_BASE_URL}/anime/${id}/characters`
    );
    return data.data;
}

// Get anime recommendations
export async function getAnimeRecommendations(id: number) {
    const data = await fetchWithRateLimit(
        `${API_BASE_URL}/anime/${id}/recommendations`
    );
    return data.data;
}

// Search anime
// export async function searchAnime(query: string, page = 1, limit = 12) {
//     const data = await fetchWithRateLimit(
//         `${API_BASE_URL}/anime?q=${encodeURIComponent(
//             query
//         )}&page=${page}&limit=${limit}`
//     );
//     return data;
// }

// Get anime by genre
// export async function getAnimeByGenre(genreId: number, page = 1, limit = 12) {
//     const data = await fetchWithRateLimit(
//         `${API_BASE_URL}/anime?genres=${genreId}&page=${page}&limit=${limit}`
//     );
//     return data;
// }

// Get all genres
export async function getGenres() {
    const data = await fetchWithRateLimit(`${API_BASE_URL}/genres/anime`);
    return data.data;
}

// Helper function to format streaming platforms
export function formatStreamingPlatforms(streamingLinks: streaming[] = []) {
    if (!streamingLinks || streamingLinks.length === 0) {
        return [];
    }

    return streamingLinks.map((link) => {
        // Extract platform name from URL
        const name = link.name;
        let logo = name.charAt(0).toUpperCase();

        // Assign colors based on common streaming platforms
        let color = '';
        if (name.toLowerCase().includes('crunchyroll')) {
            color = 'bg-orange-600';
            logo = 'C';
        } else if (name.toLowerCase().includes('netflix')) {
            color = 'bg-red-600';
            logo = 'N';
        } else if (name.toLowerCase().includes('hulu')) {
            color = 'bg-green-600';
            logo = 'H';
        } else if (name.toLowerCase().includes('amazon')) {
            color = 'bg-blue-600';
            logo = 'A';
        } else if (name.toLowerCase().includes('funimation')) {
            color = 'bg-purple-600';
            logo = 'F';
        } else {
            color = 'bg-blue-800';
        }

        return {
            name,
            logo,
            url: link.url,
            color,
            subscription: 'Subscription required',
            price: 'Varies by region',
        };
    });
}
