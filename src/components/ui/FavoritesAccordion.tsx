'use client'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'

import { useFavorites } from '@/context/favoriteContext'
import { ContentAccordion } from './AnimeListAccordions'

// remember to add Types

export function FavoritesAccordion() {
    const { favorites } = useFavorites()

    return (
        <div className="mx-auto w-full py-2">
            <Accordion
                type="single"
                collapsible
                className="w-full overflow-hidden rounded-lg border border-purple-600/80"
            >
                <AccordionItem value="favorite-list" className="border-0">
                    <AccordionTrigger className="hover:bg-muted/50 px-4 py-3 text-base transition-all">
                        <div className="flex items-center gap-2">
                            <span className="rounded-full px-2 py-0.5 font-medium dark:bg-purple-900/20">
                                Animes in this list: {favorites.length}
                            </span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="max-h-[720px] overflow-auto px-4 pt-2 pb-4">
                        <div className="space-y-4">
                            <ContentAccordion
                                animes={favorites}
                                title="Your Favorite Animes"
                            />
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
