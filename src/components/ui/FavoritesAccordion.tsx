'use client'

import { useState } from 'react'
// import { getStoredFavoriteAnimes } from '@/store/StorageFavoritesAnime'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { SkeletonCard } from '@/components/SkeletonCard/skeletonCard'

import { Anime } from '@/types/anime'
import { AnimeCard } from '../AnimeCard/AnimeCard'
import { useFavoriteAnimes } from '@/hooks/useFetchUserFavoriteList'

// remember to add Types

export function FavoritesAccordion() {
    const { favorites, removeFromFavorites } = useFavoriteAnimes()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    //             // const currentYear = new Date().getFullYear()
    //             // const seasons = ["winter", "spring", "summer", "fall"]
    //             // const currentMonth = new Date().getMonth()
    //             // const currentSeason = seasons[Math.floor(currentMonth / 3)]

    return (
        <div className="mx-auto w-full py-2">
            <Accordion
                type="single"
                collapsible
                className="w-full overflow-hidden rounded-lg border"
            >
                <AccordionItem value="favorite-list" className="border-0">
                    <AccordionTrigger className="hover:bg-muted/50 px-4 py-3 text-sm transition-all">
                        <div className="flex items-center gap-2">
                            <span className="rounded-full px-2 py-0.5 font-medium dark:bg-purple-900/20">
                                Animes in this list: {favorites.length}
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
                            ) : favorites.length > 0 ? (
                                <div className="grid justify-items-center gap-4 sm:grid-cols-2 md:grid md:grid-cols-3 lg:grid-cols-4">
                                    {favorites.map((anime: Anime) => (
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
