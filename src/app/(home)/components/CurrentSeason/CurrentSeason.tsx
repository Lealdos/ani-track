import { AnimeList } from '@/shared/components/AnimeList/AnimeList'
import { JikanAnime } from '@/services/JikanAPI/interfaces/JikanType'

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
