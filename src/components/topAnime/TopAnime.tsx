import { AnimeList } from '@/components/AnimeList/AnimeList'
import { getTopAnime } from '@/lib/api'

export async function TopAnime() {
    const animes = await getTopAnime()

    return <AnimeList animes={animes} showBadge SectionName="top-animes" />
}
