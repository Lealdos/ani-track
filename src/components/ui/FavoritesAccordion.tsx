'use client'

import { useState } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { SkeletonCard } from '@/components/shared/SkeletonCard/skeletonCard'
import { ChevronDown } from 'lucide-react'

import { JikanAnime } from '@/services/JikanAPI/interfaces/JikanType'
import { AnimeCard } from '../shared/AnimeCard/AnimeCard'
import { useFavorites } from '@/context/favoriteContext'

export function FavoritesAccordion() {
    const { favorites } = useFavorites()
    const [loading] = useState(false)
    const [error] = useState<string | null>(null)

    return (
        <div className="w-full">
            <Accordion
                type="single"
                collapsible
                className="w-full"
            >
                <AccordionItem value="favorite-list" className="border-0">
                    <AccordionTrigger className="group rounded-xl bg-card border border-border/50 px-4 py-3 hover:bg-card/80 hover:no-underline transition-colors [&[data-state=open]]:rounded-b-none [&[data-state=open]]:border-b-0">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-foreground">
                                    Favorites
                                </span>
                                <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-medium text-primary">
                                    {favorites.length}
                                </span>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="rounded-b-xl border border-t-0 border-border/50 bg-card/50 px-4 pt-4 pb-4">
                        {loading ? (
                            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                {[...Array(6)].map((_, index) => (
                                    <SkeletonCard key={index} />
                                ))}
                            </div>
                        ) : error ? (
                            <div className="rounded-lg bg-accent/10 border border-accent/20 p-4 text-center text-sm text-accent">
                                <p>Error: {error}</p>
                            </div>
                        ) : favorites.length > 0 ? (
                            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                {favorites.map((anime: JikanAnime) => (
                                    <AnimeCard
                                        showBadge
                                        key={`${anime.mal_id}-${anime.title}-Favorites`}
                                        anime={anime}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-lg border border-dashed border-border/60 bg-card/50 p-8 text-center">
                                <p className="text-sm text-muted-foreground">
                                    No favorites yet. Start adding anime to your favorites!
                                </p>
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
