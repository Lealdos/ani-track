'use client'
import Link from 'next/link'
import { Play, Calendar } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { getAnimeEpisodes } from '@/services/JikanAPI/jikanAnimeApi'
import { PaginationInfo } from '@/types/pageInfo'
import { formatDate } from '@/lib/utils/utils'
import { JikanEpisode } from '@/services/JikanAPI/interfaces/JikanType'

interface EpisodesListProps {
    episodes: JikanEpisode[]
    paginationProps: PaginationInfo
    animeId: number
}
export function EpisodesList({ animeId }: EpisodesListProps) {
    const [displayedEpisodes, setDisplayedEpisodes] = useState<JikanEpisode[]>(
        []
    )
    const [page, setPage] = useState(1)
    const [pagination, setPagination] = useState<PaginationInfo>()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const loader = useRef(null)

    useEffect(() => {
        const fetchEpisodes = async () => {
            try {
                setIsLoading(true)
                const { episodes, pagination } = await getAnimeEpisodes(animeId)
                setDisplayedEpisodes(episodes)
                setPagination(pagination)
            } catch (error) {
                setError('Error fetching episodes')
                console.error('Error fetching episodes:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchEpisodes()
    }, [animeId])

    useEffect(() => {
        const currentLoader = loader.current

        if (!currentLoader || !pagination?.has_next_page) return

        const handleObserver = (entries: IntersectionObserverEntry[]) => {
            const target = entries[0]
            if (target.isIntersecting && pagination.has_next_page) {
                ;(async () => {
                    setIsLoading(true)
                    const { episodes: newEpisodes, pagination: newPagination } =
                        await getAnimeEpisodes(animeId, page + 1)

                    setDisplayedEpisodes((prev) => [
                        ...(prev ?? []),
                        ...newEpisodes,
                    ])
                    setPagination(newPagination)
                    setPage((prev) => prev + 1)
                    setIsLoading(false)
                })()
            }
        }

        const option = {
            root: null,
            rootMargin: '100px',
            threshold: 0.1,
        }

        const observer = new IntersectionObserver(handleObserver, option)
        observer.observe(currentLoader)

        return () => {
            if (currentLoader) observer.unobserve(currentLoader)
        }
    }, [animeId, page, pagination?.has_next_page])

    if (!displayedEpisodes || displayedEpisodes.length === 0) {
        return (
            <div className="min-h-xl py-8 text-center text-gray-300">
                there are no episodes available for this anime.
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">
                    {/* episodes quantity */}
                    {(pagination?.last_visible_page ?? 1) > 1
                        ? `more than ${(pagination?.last_visible_page ?? 1) * 100 - 100}  episodes`
                        : `episodes ${displayedEpisodes.length}`}
                </h3>
            </div>

            <div className="space-y-2">
                {displayedEpisodes?.map((episode) => (
                    <Link
                        key={episode.mal_id}
                        href={episode.url}
                        className="block"
                        target="_blank"
                    >
                        <div className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900 p-3 transition-colors hover:bg-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-900">
                                    <Play className="h-4 w-4" />
                                </div>
                                <div>
                                    <div className="line-clamp-1 font-medium">
                                        Episodio {episode.mal_id}:{' '}
                                        {episode.title}
                                    </div>
                                    {episode.aired && (
                                        <div className="mt-1 flex items-center text-xs text-gray-300">
                                            <Calendar className="mr-1 h-3 w-3" />
                                            {formatDate(
                                                new Date(episode.aired)
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button className="rounded bg-purple-600 p-2 hover:bg-purple-700">
                                Watch
                            </button>
                        </div>
                    </Link>
                ))}
                {error && (
                    <div className="py-5 text-center text-red-500">{error}</div>
                )}
                {!pagination?.has_next_page && (
                    <div className="py-4 text-center text-gray-400">
                        No more episodes available.
                    </div>
                )}
                <div ref={loader} className="py-4 text-center text-gray-300">
                    {isLoading && 'Loading more episodes...'}
                </div>
            </div>
        </div>
    )
}

// 'use client'
// import Link from 'next/link'
// import { Play, Calendar } from 'lucide-react'
// import { useEffect, useState } from 'react' // No need for useRef for the loader now, as useIntersectionObserver provides it
// import { useIntersectionObserver } from 'usehooks-ts'

// import { getAnimeEpisodes } from '@/lib/api'
// import { paginationProps } from '@/types/pageInfo'
// import { formatDate } from '@/lib/utils'

// interface Episode {
//   mal_id: number
//   title: string
//   aired?: string
// }

// interface EpisodesListProps {
//   // If episodes and paginationProps are always fetched internally,
//   // these props might be unnecessary and can be removed.
//   // episodes: Episode[]
//   // paginationProps: paginationProps
//   animeId: number
// }

// export function EpisodesList({ animeId }: EpisodesListProps) {
//   const [displayedEpisodes, setDisplayedEpisodes] = useState<Episode[]>([])
//   const [page, setPage] = useState(1)
//   const [pagination, setPagination] = useState<paginationProps>()
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   // Correct usage of useIntersectionObserver based on your provided documentation
//   const { ref: loaderRef, isIntersecting } = useIntersectionObserver({
//     root: null, // Default is the browser viewport
//     rootMargin: '100px', // Load new items when the loader is 100px from the viewport
//     threshold: 0.1, // Trigger when 10% of the loader is visible
//   })

//   // Effect to fetch initial episodes or when page changes (for subsequent fetches)
//   useEffect(() => {
//     const fetchEpisodes = async (pageNumber: number) => {
//       // Prevent fetching if already loading or if there's no next page
//       // (for subsequent fetches, ensure we don't try to fetch if we already know there's no next page)
//       if (isLoading || (pageNumber > 1 && !pagination?.has_next_page)) {
//         return
//       }

//       setIsLoading(true)
//       setError(null) // Clear previous errors

//       try {
//         const { episodes: newEpisodes, pagination: newPagination } =
//           await getAnimeEpisodes(animeId, pageNumber)

//         if (pageNumber === 1) {
//           // Initial load or reset
//           setDisplayedEpisodes(newEpisodes)
//         } else {
//           // Subsequent loads, append episodes
//           setDisplayedEpisodes((prev) => [...(prev ?? []), ...newEpisodes])
//         }
//         setPagination(newPagination)
//       } catch (err) {
//         setError('Failed to fetch episodes. Please try again later.')
//         console.error('Error fetching episodes:', err)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     // Trigger fetch whenever animeId or page changes
//     // If page is 1, it's an initial load or reset due to animeId change.
//     // If page > 1, it's an infinite scroll trigger.
//     fetchEpisodes(page)

//   }, [animeId, isLoading, page, pagination?.has_next_page]) // Dependencies for the fetch effect.

//   // Effect to handle infinite scroll triggered by intersection observer
//   useEffect(() => {
//     // Only increment page if loader is intersecting, there's a next page, and not already loading
//     if (isIntersecting && pagination?.has_next_page && !isLoading) {
//       setPage((prev) => prev + 1)
//     }
//   }, [isIntersecting, pagination?.has_next_page, isLoading]) // Dependencies for the intersection observer trigger

//   if (!displayedEpisodes || displayedEpisodes.length === 0) {
//     if (isLoading && page === 1) {
//       // Show initial loading only if no episodes are displayed yet and it's the first page
//       return (
//         <div className="min-h-xl py-8 text-center text-gray-300">
//           Loading episodes...
//         </div>
//       )
//     }
//     if (error && page === 1) {
//       // Show error if initial fetch failed
//       return (
//         <div className="min-h-xl py-8 text-center text-red-500">{error}</div>
//       )
//     }
//     // Only show "no episodes" if not loading and no error, and no episodes
//     if (!isLoading && !error && (pagination && !pagination.has_next_page || displayedEpisodes.length === 0)) {
//         return (
//             <div className="min-h-xl py-8 text-center text-gray-300">
//                 There are no episodes available for this anime.
//             </div>
//         )
//     }
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <h3 className="text-xl font-bold">
//           {/* episodes quantity */}
//           {(pagination?.last_visible_page ?? 1) > 1
//             ? `More than ${(pagination?.last_visible_page ?? 1) * 100 - 100} episodes`
//             : `Episodes ${displayedEpisodes.length}`}
//         </h3>
//       </div>

//       <div className="space-y-2">
//         {displayedEpisodes?.map((episode) => (
//           <Link
//             key={episode.mal_id}
//             href={`/anime/${animeId}/watch/${episode.mal_id}`}
//             className="block"
//           >
//             <div className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900 p-3 transition-colors hover:bg-gray-800">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-900">
//                   <Play className="h-4 w-4" />
//                 </div>
//                 <div>
//                   <div className="line-clamp-1 font-medium">
//                     Episode {episode.mal_id}: {episode.title}
//                   </div>
//                   {episode.aired && (
//                     <div className="mt-1 flex items-center text-xs text-gray-300">
//                       <Calendar className="mr-1 h-3 w-3" />
//                       {formatDate(new Date(episode.aired))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//               <button className="rounded bg-purple-600 p-2 hover:bg-purple-700">
//                 Watch
//               </button>
//             </div>
//           </Link>
//         ))}
//         {error && (
//           <div className="py-5 text-center text-red-500">{error}</div>
//         )}
//         {/* Only show "No more episodes available" if we've fetched some episodes and know there's no next page */}
//         {!pagination?.has_next_page && displayedEpisodes.length > 0 && (
//           <div className="py-4 text-center text-gray-400">
//             No more episodes available.
//           </div>
//         )}
//         {/* Attach the ref from useIntersectionObserver to your loader element */}
//         {/* Only show loader if there's a potential next page or we're in the process of initial loading */}
//         {(pagination?.has_next_page || (isLoading && page === 1)) && (
//           <div ref={loaderRef} className="py-4 text-center text-gray-300">
//             {isLoading ? 'Loading more episodes...' : ''}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
