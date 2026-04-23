/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import type { JikanAnime } from '@/services/JikanAPI/interfaces/JikanType'
import { AddFavoritesButton } from '@/components/ui/AddToFavoritesListButton'

import {
    Calendar,
    Tv,
    Star,
    Film,
    TvMinimalPlay,
    BookmarkPlus,
} from 'lucide-react'
import { AddToListButton } from '../AddToListButton/AddToListButton'
import { imgOf } from '@/services/JikanAPI/utils/jikan'

interface AnimeCardProps {
    anime: JikanAnime
    showBadges?: boolean
    hasFooter?: boolean
}

export function AniemeCard({
    anime,
    showBadges = false,
    hasFooter = true,
}: AnimeCardProps) {
    return (
        <article className="flex max-w-[200px] min-w-38 flex-col items-center justify-between overflow-hidden rounded-lg transition-all duration-400 hover:shadow-xl hover:shadow-indigo-500/60 md:h-full md:max-w-60 md:min-w-[200px]">
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
                        className="h-60 w-80 rounded object-fill md:h-90 md:w-full md:object-top"
                    />
                    {showBadges && !!anime?.score && (
                        <div className="absolute top-2 right-2 m-auto flex items-center justify-center gap-1 rounded-sm bg-yellow-500 p-1 font-semibold text-shadow-black text-shadow-md">
                            {anime.score.toFixed(1)}
                            <Star className="size-3 fill-current" />
                        </div>
                    )}
                    {showBadges && (
                        <div className="absolute top-15 right-2 flex flex-col items-center justify-center gap-2">
                            <AddFavoritesButton anime={anime} />
                            <AddToListButton anime={anime} />
                        </div>
                    )}
                </div>
                {hasFooter && (
                    <footer className="flex h-full flex-col items-center justify-center p-2 text-balance">
                        <h3 className="my-2 line-clamp-2 text-center leading-tight font-medium text-balance">
                            {anime.title}
                        </h3>
                        <div className="mb-2 flex flex-row flex-wrap items-center justify-center gap-2 text-sm">
                            <small className="flex flex-row items-center gap-1">
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
                            </small>
                            {anime.episodes ? (
                                <div className="flex flex-row items-center gap-1">
                                    <TvMinimalPlay className="size-4" />
                                    {anime.episodes} eps
                                </div>
                            ) : (
                                <div className="flex flex-row items-center gap-1">
                                    <TvMinimalPlay className="size-4" />
                                    not specified
                                </div>
                            )}
                            {anime.status != 'Currently Airing' && (
                                <small className="flex flex-row items-center gap-1">
                                    <Calendar className="size-4" />
                                    {anime.status}
                                </small>
                            )}
                        </div>
                    </footer>
                )}
            </Link>
        </article>
    )
}

export function AnimeCard({
    anime,
    displayAnimeRank = false,
    showBadges = false,
}: {
    anime: JikanAnime
    displayAnimeRank?: boolean
    showBadges?: boolean
}) {
    const title = anime.title_english || anime.title
    return (
        <Link
            href={`/anime/${anime.mal_id}`}
            className="group shadow-soft transition-silk relative block overflow-hidden rounded-lg bg-card hover:-translate-y-1 hover:shadow-petal"
        >
            <div className="relative aspect-2/3 overflow-hidden bg-muted">
                <img
                    src={imgOf(anime)}
                    alt={`${title} poster`}
                    loading="lazy"
                    className="transition-silk h-full w-full object-cover group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background via-background/30 to-transparent opacity-90" />
                {displayAnimeRank && (
                    <span className="font-display absolute top-2 left-2 rounded-full bg-background/80 px-2.5 py-0.5 text-sm font-semibold text-primary backdrop-blur">
                        #{anime.rank}
                    </span>
                )}
                {anime.score ? (
                    <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-background/80 px-2 py-0.5 text-sm font-medium text-gold backdrop-blur">
                        <Star className="h-3 w-3 fill-current" />
                        {anime.score.toFixed(1)}
                    </span>
                ) : null}
                {showBadges && (
                    <div className="absolute top-15 right-2 flex flex-col items-center justify-center gap-2">
                        <AddFavoritesButton anime={anime} />
                        <AddToListButton anime={anime} />
                    </div>
                )}
            </div>
            <div className="absolute inset-x-0 bottom-0 p-3">
                <h3 className="font-display line-clamp-2 text-base leading-tight text-foreground transition-colors group-hover:text-primary md:text-lg">
                    {title}
                </h3>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground md:text-base">
                    {anime.type && (
                        <span className="inline-flex items-center gap-1">
                            <Tv className="h-3 w-3" />
                            {anime.type}
                        </span>
                    )}
                    {anime.episodes && <span>· {anime.episodes} ep</span>}
                    {anime.year && <span>· {anime.year}</span>}
                </div>
            </div>
        </Link>
    )
}
