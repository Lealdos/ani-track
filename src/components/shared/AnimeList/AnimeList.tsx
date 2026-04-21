import { AnimeCard } from '@/components/shared/AnimeCard/AnimeCard'
import { Skeleton } from '@/components/ui/skeleton'
import { JikanAnime } from '@/services/JikanAPI/interfaces/JikanType'
import { use } from 'react'

interface AnimeListProps {
    animes: Promise<JikanAnime[]> | JikanAnime[]
    showBadge?: boolean
    SectionName?: string
    emptyText?: string
}

export function AnimeList({
    animes: animesPromise,
    showBadge = false,
    SectionName,
    emptyText = 'Nothing here yet.',
}: AnimeListProps) {
    const animes =
        animesPromise instanceof Promise ? use(animesPromise) : animesPromise
    if (!animes)
        return (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {Array.from({ length: 12 }).map((_, i) => (
                    <Skeleton
                        key={`skeleton-${crypto.randomUUID()}`}
                        className="bg-muted/60 aspect-2/3 w-full rounded-lg"
                    />
                ))}
            </div>
        )

    if (!animes?.length) {
        return (
            <p className="text-muted-foreground py-16 text-center">
                {emptyText}
            </p>
        )
    }
    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {animes.map((animeItem, i) => (
                <div
                    key={animeItem.mal_id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${i * 30}ms` }}
                >
                    <AnimeCard
                        anime={animeItem}
                        key={`${animeItem.title}-${animeItem.mal_id}-${SectionName}`}
                    />
                </div>
            ))}
        </div>
    )

    // return (
    //     <ul className="grid grid-cols-2 justify-items-center gap-2 px-4 py-4 sm:grid-cols-3 md:overflow-visible lg:grid-cols-4 xl:grid-cols-5">
    //         {animes.map((animeItem) => (
    //             <AnimeCard
    //                 key={`${animeItem.title}-${animeItem.mal_id}-${SectionName}`}
    //                 anime={animeItem}
    //                 showBadge={showBadge}
    //             />
    //         ))}
    //     </ul>
    // )
}
