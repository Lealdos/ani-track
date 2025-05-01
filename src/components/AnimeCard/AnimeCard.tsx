import Link from 'next/link'
import type { Anime } from '@/types/anime'
import Image from 'next/image'
// import { AddToListButton } from '@/components/add-to-list-button';

interface AnimeCardProps {
    anime: Anime
    showBadge?: boolean
}

export function AnimeCard({ anime, showBadge = false }: AnimeCardProps) {
    return (
        <article className="flex h-full flex-col items-center justify-between overflow-hidden rounded-lg border bg-black transition-all duration-400 hover:scale-105 hover:shadow-xl md:w-full">
            <Link href={`/anime/${anime.mal_id}`} className="w-full">
                <div className="relative">
                    <Image
                        src={
                            anime.images?.webp?.image_url || '/placeholder.jpg'
                        }
                        alt={anime.title}
                        className="h-[360px] max-h-[360px] w-[500px] rounded sm:object-fill md:object-cover"
                        width={800}
                        height={580}
                        priority
                    />
                    {showBadge && anime.score && (
                        <div className="absolute top-2 right-2 m-auto rounded-md bg-yellow-500 p-1">
                            ★ {anime.score.toFixed(1)}
                        </div>
                    )}
                </div>
                <section className="p-3">
                    <h3 className="line-clamp-2 leading-tight font-medium">
                        {anime.title}
                    </h3>
                    <p className="mt-1 text-sm">
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
                <button className="bg-primary hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium">
                    Add to list
                </button>
            </div>
        </article>
    )
}
