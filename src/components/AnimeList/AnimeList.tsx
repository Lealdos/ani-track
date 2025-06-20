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
        <main className="grid grid-cols-2 justify-items-center gap-4 px-4 py-4 sm:grid-cols-3  md:overflow-visible xl:grid-cols-5">
            {animes.map((animeItem) => (
                <AnimeCard
                    key={`${animeItem.title}-${animeItem.mal_id}-${SectionName}`}
                    anime={animeItem}
                    showBadge={showBadge}
                />
            ))}
        </main>
    )
}
