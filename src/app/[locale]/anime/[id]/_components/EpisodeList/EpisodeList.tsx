'use client'
import { Play, Calendar } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

import { animeRepository } from '@/entities/anime/api'
import { PaginationInfo } from '@/types/pageInfo'
import { formatDate } from '@/lib/utils'
import type { Episode } from '@/entities/anime/models'

interface EpisodesListProps {
    animeId: number
}
export function EpisodesList({ animeId }: EpisodesListProps) {
    const t = useTranslations('Episodes')
    const [displayedEpisodes, setDisplayedEpisodes] = useState<Episode[]>([])
    const [page, setPage] = useState(1)
    const [pagination, setPagination] = useState<PaginationInfo>({
        current_page: 1,
        has_next_page: false,
        last_visible_page: 1,
    })
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const loader = useRef(null)

    useEffect(() => {
        const fetchEpisodes = async () => {
            try {
                setIsLoading(true)
                const { episodes, pagination } =
                    await animeRepository.findEpisodes(animeId)
                setDisplayedEpisodes(episodes)
                setPagination(pagination)
            } catch (error) {
                setError(t('errorFetching'))
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
                        await animeRepository.findEpisodes(animeId, page + 1)

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

    if (isLoading && displayedEpisodes.length === 0) {
        return (
            <div className="min-h-xl m-auto py-8 text-center text-5xl text-gray-300">
                {t('loadingEpisodes')}
            </div>
        )
    }

    if (!displayedEpisodes || displayedEpisodes.length === 0) {
        return (
            <div className="min-h-xl py-8 text-center text-gray-300">
                {t('noEpisodes')}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">
                    {/* episodes quantity */}
                    {(pagination?.last_visible_page ?? 1) > 1
                        ? t('moreThanEpisodes', {
                              count:
                                  (pagination?.last_visible_page ?? 1) * 100 -
                                  100,
                          })
                        : t('episodesCount', {
                              count: displayedEpisodes.length,
                          })}
                </h3>
            </div>

            <div className="space-y-2">
                {displayedEpisodes?.map((episode) => (
                    <a
                        key={episode.id}
                        href={episode.url}
                        className="block"
                        target="_blank"
                    >
                        <div className="bg-amber-950/34 flex items-center justify-between rounded-lg border border-gray-800 p-3 transition-colors hover:bg-amber-950/50">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-900">
                                    <Play className="h-4 w-4" />
                                </div>
                                <div>
                                    <div className="line-clamp-1 font-medium">
                                        {t('episodeLabel', {
                                            id: episode.id,
                                            title: episode.title,
                                        })}
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
                            <button className="rounded bg-rose-900 p-2 hover:bg-rose-700">
                                {t('watch')}
                            </button>
                        </div>
                    </a>
                ))}
                {error && (
                    <div className="py-5 text-center text-red-500">{error}</div>
                )}
                {!pagination?.has_next_page && (
                    <div className="py-4 text-center text-gray-400">
                        {t('noMoreEpisodes')}
                    </div>
                )}
                <div ref={loader} className="py-4 text-center text-gray-300">
                    {isLoading && t('loadingMore')}
                </div>
            </div>
        </div>
    )
}
