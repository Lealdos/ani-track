/* eslint-disable @next/next/no-img-element */
import { Link } from '@/i18n/navigation'
import type { Anime } from '@/entities/anime/models'
import { AddFavoritesButton } from '@/components/shared/AddToFavorites/AddToFavoritesListButton'

import { Tv, Star } from 'lucide-react'
import { AddToListButton } from '../AddToListButton/AddToListButton'
import { imgOf } from '@/entities/anime/models'

interface AnimeCardProps {
    anime: Anime
    showBadges?: boolean
    displayAnimeRank?: boolean
}

export function AnimeCard({
    anime,
    displayAnimeRank = false,
    showBadges = false,
}: AnimeCardProps) {
    const title = anime.titleEnglish || anime.title
    return (
        <Link
            href={`/anime/${anime.id}`}
            className="shadow-soft transition-silk bg-card hover:shadow-petal group relative block overflow-hidden rounded-lg hover:-translate-y-1"
        >
            <div className="aspect-2/3 bg-muted relative overflow-hidden">
                <img
                    src={imgOf(anime)}
                    alt={`${title} poster`}
                    loading="lazy"
                    className="transition-silk h-full w-full object-cover group-hover:scale-105"
                />
                <div className="bg-linear-to-t from-background via-background/30 absolute inset-0 to-transparent opacity-90" />
                {displayAnimeRank && (
                    <span className="font-display bg-background/80 text-primary absolute left-2 top-2 rounded-full px-2.5 py-0.5 text-sm font-semibold backdrop-blur">
                        #{anime.rank}
                    </span>
                )}
                {anime.score ? (
                    <span className="bg-background/80 text-gold absolute right-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-sm font-medium backdrop-blur">
                        <Star className="h-3 w-3 fill-current" />
                        {anime.score.toFixed(1)}
                    </span>
                ) : null}
                {showBadges && (
                    <div className="top-15 absolute right-2 flex flex-col items-center justify-center gap-2">
                        <AddFavoritesButton anime={anime} />
                        <AddToListButton anime={anime} />
                    </div>
                )}
            </div>
            <div className="absolute inset-x-0 bottom-0 p-3">
                <h3 className="font-display text-foreground group-hover:text-primary line-clamp-2 text-base leading-tight transition-colors md:text-lg">
                    {title}
                </h3>
                <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm md:text-base">
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
