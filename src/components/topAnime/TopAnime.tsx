import { AnimeList } from '@/components/AnimeList/AnimeList'
import { Anime } from '@/types/anime'
interface TopAnimeProps {
    topAnime: Promise<Anime[]>
}

export function TopAnime({ topAnime }: TopAnimeProps) {
    return <AnimeList animes={topAnime} showBadge SectionName="top-animes" />
}
