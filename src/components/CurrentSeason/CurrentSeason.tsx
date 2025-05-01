import { AnimeList } from '@/components/AnimeList/AnimeList'
import { getSeasonalAnime } from '@/lib/api'

export async function CurrentSeason() {
    const animes = await getSeasonalAnime()

    return <AnimeList animes={animes} showBadge SectionName="current-season" />
}
