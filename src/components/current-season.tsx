import { AnimeList } from '@/components/anime-list'
import { getSeasonalAnime } from '@/lib/api'

export async function CurrentSeason() {
    const animes = await getSeasonalAnime()

    return <AnimeList animes={animes} showBadge SectionName="current-season" />
}
