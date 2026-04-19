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
} from 'lucide-react'
import { AddToListButton } from '../AddToListButton/AddToListButton'

interface AnimeCardProps {
    anime: JikanAnime
    showBadge?: boolean
    hasFooter?: boolean
}

export function AnimeCard({
    anime,
    showBadge = false,
    hasFooter = true,
}: AnimeCardProps) {
    return (
        <article className="anime-card group relative flex w-full max-w-[180px] flex-col overflow-hidden rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/10 md:max-w-[200px]">
            <Link
                href={`/anime/${anime.mal_id}`}
                className="flex h-full w-full flex-col"
            >
                {/* Image Container */}
                <div className="relative aspect-[2/3] w-full overflow-hidden">
                    <img
                        src={anime.images?.webp?.image_url || '/placeholder.svg'}
                        alt={anime.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
                    
                    {/* Score Badge */}
                    {showBadge && anime.score && (
                        <div className="absolute top-2 left-2 flex items-center gap-1 rounded-md bg-background/90 backdrop-blur-sm px-2 py-1 text-xs font-bold text-foreground">
                            <Star className="size-3 fill-amber-400 text-amber-400" />
                            {anime.score.toFixed(1)}
                        </div>
                    )}
                    
                    {/* Type Badge */}
                    <div className="absolute bottom-2 left-2 rounded-md bg-primary/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
                        {anime.type || 'TV'}
                    </div>
                </div>
                
                {/* Action Buttons - Overlay on hover */}
                {showBadge && (
                    <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" onClick={(e) => e.preventDefault()}>
                        <AddFavoritesButton anime={anime} />
                        <AddToListButton anime={anime} />
                    </div>
                )}

                {/* Content */}
                {hasFooter && (
                    <div className="flex flex-1 flex-col justify-between p-3">
                        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground text-balance">
                            {anime.title}
                        </h3>
                        
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                            {anime.episodes ? (
                                <span className="flex items-center gap-1">
                                    <TvMinimalPlay className="size-3" />
                                    {anime.episodes} eps
                                </span>
                            ) : (
                                <span className="flex items-center gap-1">
                                    <TvMinimalPlay className="size-3" />
                                    Ongoing
                                </span>
                            )}
                            
                            {anime.status === 'Currently Airing' && (
                                <span className="flex items-center gap-1 text-primary font-medium">
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                                    </span>
                                    Airing
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </Link>
        </article>
    )
}
