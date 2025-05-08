import { AnimeCard } from '@/components/AnimeCard/AnimeCard'
import type { Anime } from '@/types/anime'
import { use } from 'react'

interface AnimeListProps {
    animes: Promise<Anime[]> | Anime[]
    showBadge?: boolean
    SectionName?: string
}

export function AnimeList({
    animes: animesPromise,
    showBadge = false,
    SectionName,
}: AnimeListProps) {
    const animes =
        animesPromise instanceof Promise ? use(animesPromise) : animesPromise
    if (!animes) return <div>Loading...</div>
    return (
        <main className="scrollbar-hide flex snap-x gap-4 overflow-x-auto px-4 pb-4 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5">
            {animes.map((animeItem) => (
                <div
                    key={`${animeItem.title}-${animeItem.mal_id}-${SectionName}`}
                    className="w-[70%] shrink-0 snap-start sm:w-[50%] md:w-auto"
                >
                    <AnimeCard anime={animeItem} showBadge={showBadge} />
                </div>
            ))}
        </main>
    )
}
