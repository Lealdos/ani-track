import { AnimeList } from '@/components/AnimeList/AnimeList'
import { Anime } from '@/types/anime'

interface CurrentSeasonProps {
    currentSeason: Promise<Anime[]>
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
