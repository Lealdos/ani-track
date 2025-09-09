import { AnimeList } from '@/components/AnimeList/AnimeList'
import { JikanAnime } from '@/types/anime'

interface CurrentSeasonProps {
    currentSeason: Promise<JikanAnime[]>
}

export function CurrentSeason({
    currentSeason,
}: CurrentSeasonProps): React.ReactElement {
    return (
        <AnimeList
            animes={currentSeason}
            showBadge
            SectionName="current-season"
        />
    )
}
