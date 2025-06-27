'use client'

import { useState, useEffect } from 'react' 
// import { Badge } from '@/components/ui/badge'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { SkeletonCard } from '@/components/SkeletonCard/skeletonCard'

import { getAnimeByGenre } from '@/lib/api'
import { Anime } from '@/types/anime'
import { AnimeCard } from '../AnimeCard/AnimeCard'

// Tipo para las listas de favoritos


export function FavoritesAccordion() {
    const [favoriteLists, setFavoriteLists] = useState<Anime[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Función para cargar los datos de cada lista
        const loadListData = async () => {
            try {
                // Obtener anime romántico (género 22)
                const romanceAnime = await getAnimeByGenre(22)
                updateListData( romanceAnime)
                setLoading(false)

                // Obtener anime de la temporada actual
                // const currentYear = new Date().getFullYear()
                // const seasons = ["winter", "spring", "summer", "fall"]
                // const currentMonth = new Date().getMonth()
                // const currentSeason = seasons[Math.floor(currentMonth / 3)]

            
            } catch (error) {
                setError(`Error loading data error ${error}`)
                console.error('Error loading data:', error)
            }
        }

        loadListData()
    }, [])

    // Función para actualizar los datos de una lista específica
    const updateListData = ( FavAnimes: Anime[]) => {
        setFavoriteLists(FavAnimes)

    }
    return (
        <div className="mx-auto w-full py-2">
            <Accordion
                type="single"
                collapsible
                className="w-full overflow-hidden rounded-lg border"
            >
                <AccordionItem value="listas-favoritos" className="border-0">
                    <AccordionTrigger className="hover:bg-muted/50 px-4 py-3 transition-all text-sm">
                        <div className="flex items-center gap-2">
                            <span className="rounded-full px-2 py-0.5  font-medium dark:bg-purple-900/20 ">
                                Animes in this list: {favoriteLists.length}
                            </span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="max-h-[720px] overflow-auto px-4 pt-2 pb-4">
                        <div className="space-y-4">
                        {loading ? (
                        <div className="grid md:grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                            {[...Array(6)].map((_, index) => (
                                <SkeletonCard key={index} />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="p-4 text-center text-red-500">
                            <p>Error: {error}</p>
                        </div>
                    ) : favoriteLists.length > 0 ? (
                        <div className="grid md:grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center
                        ">
                             {favoriteLists.map((anime) => (
                                <AnimeCard
                                    showBadge
                                    key={`${anime.mal_id}-${anime.title}`}
                                    anime={anime}
                                />
                            ))}
                        </div>
                    ) : (
                        <span className="block px-2 py-0.5 text-lg font-medium text-slate-100 text-center">
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
