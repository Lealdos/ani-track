import Link from 'next/link'
import type { Anime } from '@/types/anime'
import Image from 'next/image'
// import { AddToListButton } from '@/components/add-to-list-button';

interface AnimeCardProps {
    anime: Anime
    showBadge?: boolean
    hasFooter?: boolean
}

export function AnimeCard({
    anime,
    showBadge = false,
    hasFooter = true,
}: AnimeCardProps) {
    return (
        <article className="flex h-full flex-col items-center justify-between overflow-hidden rounded-lg border bg-black transition-all duration-400 hover:scale-105 hover:shadow-xl md:w-full">
            <Link
                href={`/anime/${anime.mal_id}`}
                className="flex w-full flex-col"
            >
                <div className="relative">
                    <Image
                        src={
                            anime.images?.webp?.image_url || '/placeholder.jpg'
                        }
                        alt={anime.title}
                        className="h-[380px] max-h-[380px] w-[500px] rounded sm:object-fill md:object-cover"
                        width={800}
                        height={580}
                        priority
                    />
                    {showBadge && anime.score && (
                        <div className="absolute top-2 right-2 m-auto flex items-center justify-center rounded-sm bg-yellow-500/90 p-1 font-semibold text-shadow-black text-shadow-md">
                            ★ {anime.score.toFixed(1)}
                        </div>
                    )}
                </div>
                {hasFooter && (
                    <footer className="p-3">
                        <h3 className="my-2 line-clamp-2 justify-start leading-tight font-medium">
                            {anime.title}
                        </h3>
                        <p className="mb-2 text-sm">
                            {anime.type} •{' '}
                            {anime.episodes
                                ? `${anime.episodes} eps`
                                : 'still airing'}{' '}
                            • {anime.status}
                        </p>
                    </footer>
                )}
            </Link>
        </article>
    )
}
