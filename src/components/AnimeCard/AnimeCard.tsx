/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import type { Anime } from '@/types/anime'
import { AddToListButton } from '@/components/ui/AddToListButton'

import {
    Calendar,
    Tv,
    Star,
    Film,
    TvMinimalPlay,
    BookmarkPlus,
} from 'lucide-react'

interface AnimeCardProps {
    anime: Anime
    showBadge?: boolean
    hasFooter?: boolean
    FavoriteListFunction?: (animeId: number) => void
}

export function AnimeCard({
    anime,
    showBadge = false,
    hasFooter = true,
}: AnimeCardProps) {
    return (
        <article className="flex h-80 max-w-[200px] flex-col items-center justify-between overflow-hidden rounded-lg border bg-black/80 transition-all duration-400 hover:shadow-xl hover:shadow-indigo-500/60 md:h-full md:max-w-[320px]">
            <Link
                href={`/anime/${anime.mal_id}`}
                className="flex h-full w-full flex-col"
            >
                <div className="relative">
                    <img
                        src={
                            anime.images?.webp?.image_url || '/placeholder.svg'
                        }
                        alt={anime.title}
                        className="h-50 max-h-[320px] w-[360px] rounded object-fill md:h-[320px]"
                        width={360}
                        height={380}
                    />
                    {showBadge && anime.score && (
                        <div className="absolute top-2 right-2 m-auto flex items-center justify-center gap-1 rounded-sm bg-yellow-500 p-1 font-semibold text-shadow-black text-shadow-md">
                            {anime.score.toFixed(1)}
                            <Star className="size-3 fill-current" />
                        </div>
                    )}
                    {showBadge && (
                        <div className="absolute top-15 right-2 flex flex-col items-center justify-center gap-2">
                            <AddToListButton anime={anime} />
                            <button className="rounded bg-black/50 p-1 text-white hover:bg-black/70">
                                <BookmarkPlus className="size-6" />
                                <span className="sr-only">Add to a list</span>
                            </button>
                        </div>
                    )}
                </div>
                {hasFooter && (
                    <footer className="flex h-full flex-col items-center justify-center p-2 text-balance">
                        <h3 className="my-2 line-clamp-2 text-center leading-tight font-medium text-balance">
                            {anime.title}
                        </h3>
                        <div className="mb-2 flex flex-row flex-wrap items-center justify-center gap-2 text-sm">
                            <button className="flex flex-row items-center gap-1">
                                {anime?.type?.toLocaleLowerCase() ===
                                'movie' ? (
                                    <>
                                        <Film className="size-4" /> {anime.type}
                                    </>
                                ) : (
                                    <>
                                        <Tv className="size-4" /> {anime.type}
                                    </>
                                )}
                            </button>
                            {anime.episodes ? (
                                <div className="flex flex-row items-center gap-1">
                                    <TvMinimalPlay className="size-4" />
                                    {anime.episodes} eps
                                </div>
                            ) : (
                                <div className="flex flex-row items-center gap-1">
                                    <TvMinimalPlay className="size-4" />
                                    still airing
                                </div>
                            )}
                            <button className="flex flex-row items-center gap-1">
                                <Calendar className="size-4" />
                                {anime.status}
                            </button>
                        </div>
                    </footer>
                )}
            </Link>
        </article>
    )
}
