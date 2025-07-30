'use client'
import Link from 'next/link'
import { Play, Calendar } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { getAnimeEpisodes } from '@/lib/api'
import { paginationProps } from '@/types/pageInfo'
import { formatDate } from '@/lib/utils'
interface Episode {
    mal_id: number
    title: string
    aired?: string
}

interface EpisodesListProps {
    episodes: Episode[]
    paginationProps: paginationProps
    animeId: number
}
export function EpisodesList({ animeId }: EpisodesListProps) {
    const [displayedEpisodes, setDisplayedEpisodes] = useState<Episode[]>()
    const [page, setPage] = useState(1)
    const [pagination, setPagination] = useState<paginationProps>()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const loader = useRef(null)

    useEffect(() => {
        const fetchEpisodes = async () => {
            setIsLoading(true)
            const { episodes, pagination } = await getAnimeEpisodes(animeId)
            setDisplayedEpisodes(episodes)
            setPagination(pagination)
            setIsLoading(false)
        }
        fetchEpisodes()
    }, [animeId])

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
                        href={`/anime/${animeId}/watch/${episode.mal_id}`}
                        className="block"
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
