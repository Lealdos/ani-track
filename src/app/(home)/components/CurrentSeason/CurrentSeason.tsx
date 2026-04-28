import { AnimeList } from '@/components/shared/AnimeList/AnimeList'
import { Anime } from '@/entities/anime/models'

interface CurrentSeasonProps {
    currentSeason: Promise<Anime[]>
}

export function CurrentSeason({
    currentSeason,
}: CurrentSeasonProps): React.ReactElement {
    return (
        <AnimeList
            animes={currentSeason}
            showRank={true}
            SectionName="current-season"
        />
    )
}
