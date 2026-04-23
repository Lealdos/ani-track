import { AnimeCard } from '@/components/shared/AnimeCard/AnimeCard'
import { Skeleton } from '@/components/ui/skeleton'
import { JikanAnime } from '@/services/JikanAPI/interfaces/JikanType'
import { use } from 'react'

interface AnimeListProps {
    animes: Promise<JikanAnime[]> | JikanAnime[]
    showRank?: boolean
    SectionName?: string
    emptyText?: string
    showBadge?: boolean
}

export function AnimeList({
    animes: animesPromise,
    showRank = false,
    SectionName,
    emptyText = 'Nothing here yet.',
    showBadge = true,
}: AnimeListProps) {
    const animes =
        animesPromise instanceof Promise ? use(animesPromise) : animesPromise
    if (!animes)
        return (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {Array.from({ length: 12 }).map((_, i) => (
                    <Skeleton
                        key={`skeleton-${crypto.randomUUID()}`}
                        className="aspect-2/3 w-full rounded-lg bg-muted/60"
                    />
                ))}
            </div>
        )

    if (!animes?.length) {
        return (
            <p className="py-16 text-center text-muted-foreground">
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
                        showBadges={showBadge}
                        displayAnimeRank={showRank}
                    />
                </div>
            ))}
        </div>
    )
}
