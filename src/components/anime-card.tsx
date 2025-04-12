import Link from 'next/link'
import type { Anime } from '@/types/anime'
// import { AddToListButton } from '@/components/add-to-list-button';

interface AnimeCardProps {
    anime: Anime
    showBadge?: boolean
}

export function AnimeCard({ anime, showBadge = false }: AnimeCardProps) {
    return (
        <article className="flex h-full flex-col items-center justify-between overflow-hidden rounded-lg border bg-black transition-all duration-400 hover:scale-105 hover:shadow-xl">
            <Link href={`/anime/${anime.mal_id}`} className="w-full">
                <div className="relative">
                    <img
                        src={
                            anime.images?.jpg.large_image_url ||
                            anime.images?.jpg.image_url ||
                            '/placeholder.jpg'
                        }
                        alt={anime.title}
                        className="max-h-[360px] w-full rounded sm:object-fill md:object-cover"
                    />
                    {showBadge && anime.score && (
                        <div className="absolute top-2 right-2 m-auto rounded-md bg-yellow-500 p-1 text-primary-foreground">
                            ★ {anime.score.toFixed(1)}
                        </div>
                    )}
                </div>
                <section className="p-3">
                    <h3 className="line-clamp-2 leading-tight font-medium">
                        {anime.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {anime.type} •{' '}
                        {anime.episodes
                            ? `${anime.episodes} eps`
                            : 'still airing'}{' '}
                        •{' '}
                    </p>
                    {anime.status}
                </section>
            </Link>
            <div className="pb-3">
                <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    Add to list
                </button>
            </div>
        </article>
    )
}
