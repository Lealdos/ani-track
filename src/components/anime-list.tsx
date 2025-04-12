import { AnimeCard } from '@/components/anime-card'
import type { Anime } from '@/types/anime'

interface AnimeListProps {
    animes: Anime[]
    showBadge?: boolean
}

export function AnimeList({ animes, showBadge = false }: AnimeListProps) {
    if (!animes) return null
    return (
        <div className="scrollbar-hide flex justify-between justify-items-stretch gap-4 overflow-x-auto rounded-md border-b-2 border-b-background/10 p-4 pb-4 md:grid md:grid-cols-3 md:flex-wrap md:gap-8 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5">
            {animes.map((anime) => (
                <div key={`${anime.title}-${anime.mal_id}`}>
                    <AnimeCard anime={anime} showBadge={showBadge} />
                </div>
            ))}
        </div>
    )
}
