'use client'

import { useState } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { SkeletonCard } from '@/components/shared/SkeletonCard/skeletonCard'

import { Anime } from '@/entities/anime/models'
import { AnimeCard } from '../shared/AnimeCard/AnimeCard'

interface ListAccordionProps {
    title: string
    animes: Anime[]
}

export function ContentAccordion({ animes, title }: ListAccordionProps) {
    const [loading] = useState(false)
    // const [error] = useState<string | null>(null)

    if (loading) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 md:grid md:grid-cols-4">
                {Array.from({ length: 6 }).map((_, index) => (
                    <SkeletonCard key={index + 2} />
                ))}
            </div>
        )
    }
    if (animes.length > 0) {
        return (
            <div className="grid justify-items-center gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {animes.map((anime: Anime) => (
                    <AnimeCard
                        showBadges
                        key={`${anime.id}-${anime.title}-${title}`}
                        anime={anime}
                    />
                ))}
            </div>
        )
    }
    return (
        <span className="block px-2 py-2 text-center text-base font-medium text-slate-100 md:text-xl">
            Nothing save in the {title.toLocaleLowerCase()} list yet. Go add
            some!
        </span>
    )
}

export function AnimeListAccordions({ animes, title }: ListAccordionProps) {
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
                        <AccordionTrigger className="px-4 py-3 text-base transition-all hover:bg-muted/50">
                            <div className="flex items-center gap-2">
                                <span className="rounded-full px-2 py-0.5 font-medium dark:bg-purple-900/20">
                                    Animes in this list: {animes.length}
                                </span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="max-h-[720px] overflow-auto px-4 pt-2 pb-4">
                            <div className="space-y-4">
                                <ContentAccordion
                                    animes={animes}
                                    title={title}
                                />
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    )
}
