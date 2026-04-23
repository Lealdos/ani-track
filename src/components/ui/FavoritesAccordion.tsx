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

// function ListAccordion({ list }: { list: FavoriteList }) {
//     return (
//         <Accordion
//             type="single"
//             collapsible
//             className="w-full overflow-hidden rounded-lg border"
//         >
//             <AccordionItem value={list.id} className="border-0">
//                 <AccordionTrigger className="hover:bg-muted/50 px-4 py-3 transition-all">
//                     <div className="flex items-center gap-2">
//                         <span className="font-medium">{list.name}</span>
//                         <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
//                             {list.loading ? '...' : list.items.length}
//                         </span>
//                     </div>
//                 </AccordionTrigger>
//                 <AccordionContent className="max-h-[720px] overflow-auto px-4 pt-2 pb-4">
//                     {list.loading ? (
//                         <div className="grid md:grid gap-4 sm:grid-cols-2 md:grid-cols-4">
//                             {[...Array(6)].map((_, index) => (
//                                 <SkeletonCard key={index} />
//                             ))}
//                         </div>
//                     ) : list.error ? (
//                         <div className="p-4 text-center text-red-500">
//                             <p>Error: {list.error}</p>
//                         </div>
//                     ) : list.items.length > 0 ? (
//                         <div className="grid md:grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center
//                         ">
//                             {list.items.map((anime) => (
//                                 <AnimeCard
//                                     showBadge
//                                     key={`${list.name}-${anime.mal_id}-${anime.title}`}
//                                     anime={anime}
//                                 />
//                             ))}
//                         </div>
//                     ) : (
//                         <span className="block px-2 py-0.5 text-lg font-medium text-slate-100 text-center">
//                             No animes in the list
//                         </span>
//                     )}
//                 </AccordionContent>
//             </AccordionItem>
//         </Accordion>
//     )
// }
