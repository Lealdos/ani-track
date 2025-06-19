'use client'

import { useState, useEffect } from 'react'
// import { Star, Calendar, Clock, Tv } from 'lucide-react'
// import { Badge } from '@/components/ui/badge'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getTopAnime, getAnimeByGenre, getSeasonalAnime } from '@/lib/api'
import { Anime } from '@/types/anime'
import { AnimeCard } from '../AnimeCard/AnimeCard'

// Tipo para las listas de favoritos
type FavoriteList = {
    id: string
    name: string
    items: Anime[]
    loading: boolean
    error: string | null
}

export function FavoritesAccordion() {
    const [favoriteLists, setFavoriteLists] = useState<FavoriteList[]>([
        {
            id: 'top-anime',
            name: 'Testing 1',
            items: [],
            loading: true,
            error: null,
        }, {
            id: 'seasonal-anime',
            name: 'Current watching',
            items: [],
            loading: true,
            error: null,
        },
        {
            id: 'action-anime',
            name: 'Watch later',
            items: [],
            loading: true,
            error: null,
        },
        {
            id: 'romance-anime',
            name: 'Romantic animes',
            items: [],
            loading: true,
            error: null,
        },

    ])

    useEffect(() => {
        // Función para cargar los datos de cada lista
        const loadListData = async () => {
            try {
                // Obtener anime popular
                const topAnime = await getTopAnime()
                updateListData('top-anime', topAnime)

                // Obtener anime de acción (género 1)
                const actionAnime = await getAnimeByGenre(1)
                updateListData('action-anime', actionAnime)

                // Obtener anime romántico (género 22)
                const romanceAnime = await getAnimeByGenre(22)
                updateListData('romance-anime', romanceAnime)


                // Obtener anime de la temporada actual
                // const currentYear = new Date().getFullYear()
                // const seasons = ["winter", "spring", "summer", "fall"]
                // const currentMonth = new Date().getMonth()
                // const currentSeason = seasons[Math.floor(currentMonth / 3)]

                const seasonalAnime = await getSeasonalAnime()
                updateListData('seasonal-anime', seasonalAnime)
            } catch (error) {
                console.error('Error loading data:', error)
            }
        }

        loadListData()
    }, [])

    // Función para actualizar los datos de una lista específica
    const updateListData = (listId: string, items: Anime[]) => {
        setFavoriteLists((prevLists) =>
            prevLists.map((list) =>
                list.id === listId
                    ? { ...list, items, loading: false, error: null }
                    : list
            )
        )
    }

    return (
        <div className="mx-auto w-full max-w-7xl p-4">
            <Accordion
                type="single"
                collapsible
                className="w-full overflow-hidden rounded-lg border"
            >
                <AccordionItem value="listas-favoritos" className="border-0">
                    <AccordionTrigger className="hover:bg-muted/50 px-4 py-3 transition-all">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">
                                All my lists
                            </span>
                            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-600 dark:bg-rose-900/20 dark:text-rose-400">
                                {favoriteLists.length}
                            </span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pt-2 pb-4 overflow-auto ">
                        <div className="space-y-4">
                            {favoriteLists.map((list) => (
                                <ListAccordion key={list.id} list={list} />
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

function ListAccordion({ list }: { list: FavoriteList }) {
    return (
        <Accordion
            type="single"
            collapsible
            className="w-full overflow-hidden rounded-lg border "
        >
            <AccordionItem value={list.id} className="border-0">
                <AccordionTrigger className="hover:bg-muted/50 px-4 py-3 transition-all">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">{list.name}</span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {list.loading ? '...' : list.items.length}
                        </span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-2 pb-4 overflow-auto max-h-[720px]">
                    {list.loading ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                            {[...Array(6)].map((_, index) => (
                                <AnimeCardSkeleton key={index} />
                            ))}
                        </div>
                    ) : list.error ? (
                        <div className="p-4 text-center text-red-500">
                            <p>Error: {list.error}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                            {list.items.map((anime) => (
                                <AnimeCard showBadge key={anime.mal_id} anime={anime} />
                            ))}
                        </div>
                    )}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}


function AnimeCardSkeleton() {
    return (
        <Card className="flex h-full flex-col overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardHeader className="p-3 pb-1">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="mt-1 h-4 w-16" />
            </CardHeader>
            <CardContent className="flex-grow p-3 pt-0">
                <Skeleton className="mb-1 h-4 w-full" />
                <Skeleton className="mb-1 h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </CardContent>
            <CardFooter className="flex gap-2 p-3 pt-0">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
            </CardFooter>
        </Card>
    )
}



// function AnimeCard({ anime }: { anime: Anime }) {
//     return (
//         <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-black/20">
//             <div className="h-48 w-full overflow-hidden">
//                 <Image
//                     src={anime?.images?.jpg.image_url || '/placeholder.svg'}
//                     alt={anime.title}
//                     className="h-full w-full object-cover"
//                     loading="lazy"
//                     width={200}
//                     height={300}
//                 />
//             </div>
//             <CardHeader className="p-3 pb-1">
//                 <CardTitle
//                     className="line-clamp-1 text-base"
//                     title={anime.title}
//                 >
//                     {anime.title}
//                 </CardTitle>
//                 <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400">
//                     <Star className="h-4 w-4 fill-current" />
//                     <span className="text-sm font-medium">
//                         {anime.score || 'N/A'}
//                     </span>
//                 </div>
//             </CardHeader>
//             <CardContent className="flex-grow p-3 pt-0">
//                 <CardDescription className="line-clamp-3">
//                     {anime.synopsis || 'No hay descripción disponible.'}
//                 </CardDescription>
//             </CardContent>
//             <CardFooter className="flex flex-wrap gap-2 p-3 pt-0">
//                 <Badge variant="outline" className="flex items-center gap-1">
//                     <Tv className="h-3 w-3" />
//                     {anime.type || 'TV'}
//                 </Badge>
//                 {anime.episodes && (
//                     <Badge
//                         variant="outline"
//                         className="flex items-center gap-1"
//                     >
//                         <Clock className="h-3 w-3" />
//                         {anime.episodes} eps
//                     </Badge>
//                 )}
//                 {anime.aired?.from && (
//                     <Badge
//                         variant="outline"
//                         className="flex items-center gap-1"
//                     >
//                         <Calendar className="h-3 w-3" />
//                         {new Date(anime.aired.from).getFullYear()}
//                     </Badge>
//                 )}
//             </CardFooter>
//         </Card>
//     )
// }