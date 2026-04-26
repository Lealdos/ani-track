/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import type { JikanAnime } from '@/services/JikanAPI/interfaces/JikanType'
import { AddFavoritesButton } from '@/components/shared/AddToFavorites/AddToFavoritesListButton'

import { Tv, Star } from 'lucide-react'
import { AddToListButton } from '../AddToListButton/AddToListButton'
import { imgOf } from '@/services/JikanAPI/utils/jikan'

interface AnimeCardProps {
    anime: JikanAnime
    showBadges?: boolean
    displayAnimeRank?: boolean
}

export function AnimeCard({
    anime,
    displayAnimeRank = false,
    showBadges = false,
}: AnimeCardProps) {
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
