'use client'

import { useState } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { SkeletonCard } from '@/components/shared/SkeletonCard/skeletonCard'

import { JikanAnime } from '@/services/JikanAPI/interfaces/JikanType'
import { AnimeCard } from '../shared/AnimeCard/AnimeCard'

interface ListAccordionProps {
    title: string
    animes: JikanAnime[]
}

export function AnimeListAccordions({ animes, title }: ListAccordionProps) {
    const [loading] = useState(false)
    const [error] = useState<string | null>(null)

    return (
        <div>
            <h3 className="font text-xl">{title}</h3>
            <div className="mx-auto w-full py-2">
                <Accordion
                    type="single"
                    collapsible
                    className="w-full overflow-hidden rounded-lg border border-purple-600/80"
                >
                    <AccordionItem value="favorite-list" className="border-0">
                        <AccordionTrigger className="hover:bg-muted/50 px-4 py-3 text-sm transition-all">
                            <div className="flex items-center gap-2">
                                <span className="rounded-full px-2 py-0.5 font-medium dark:bg-purple-900/20">
                                    Animes in this list: {animes.length}
                                </span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="max-h-[720px] overflow-auto px-4 pt-2 pb-4">
                            <div className="space-y-4">
                                {loading ? (
                                    <div className="grid gap-4 sm:grid-cols-2 md:grid md:grid-cols-4">
                                        {[...Array(6)].map((_, index) => (
                                            <SkeletonCard key={index} />
                                        ))}
                                    </div>
                                ) : error ? (
                                    <div className="p-4 text-center text-red-500">
                                        <p>Error: {error}</p>
                                    </div>
                                ) : animes.length > 0 ? (
                                    <div className="grid justify-items-center gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                        {animes.map((anime: JikanAnime) => (
                                            <AnimeCard
                                                showBadge
                                                key={`${anime.mal_id}-${anime.title}-Favorites`}
                                                anime={anime}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <span className="block px-2 py-0.5 text-center text-lg font-medium text-slate-100">
                                        No animes in the list
                                    </span>
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    )
}
