import { AnimeList } from '@/components/anime-list'
import { Anime } from '@/types/anime'
// import { fetchWithRateLimit } from '@/lib/api'
import { API_BASE_URL } from '@/config/const'
// import { getTopAnime } from '@/lib/api'

export async function getTopAnime(): Promise<Anime[]> {
    try {
        const topAnimeList = await fetch(`${API_BASE_URL}/top/anime?limit=15`, {
            cache: 'no-store',
        })

        const animes = await topAnimeList.json()
        return await animes.data
    } catch (error) {
        console.error('Error fetching top anime:', error)
        return []
    }
}

export async function TopAnime() {
    const animes = await getTopAnime()

    return <AnimeList animes={animes} showBadge SectionName="top-animes" />
}
