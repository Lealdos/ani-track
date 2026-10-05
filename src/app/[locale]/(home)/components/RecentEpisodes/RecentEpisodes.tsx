'use client'

import { useEffect, useState } from 'react'
import { useLocale, useNow, useTranslations } from 'next-intl'

import type { ApiResponse } from '@/lib/utils/apiResponse'
import {
    RECENT_EPISODES_SOURCES,
    getRecentEpisodesSource,
    type RecentEpisode,
} from '@/entities/recent-episodes/models'
import { RecentEpisodeCard } from './RecentEpisodeCard'
import { RecentEpisodesSkeleton } from './RecentEpisodesSkeleton'
import { RECENT_EPISODES_GRID } from './recentEpisodesGrid'

// Keyed by locale so switching language shows the skeleton again without
// having to reset state inside the effect.
type RecentEpisodesResult = {
    locale: string
    episodes: RecentEpisode[] | null
}

export function RecentEpisodes(): React.ReactElement {
    const t = useTranslations('RecentEpisodes')
    const locale = useLocale()
    // Keeps the "x hours ago" badges fresh while the tab stays open.
    const now = useNow({ updateInterval: 60_000 })
    const [result, setResult] = useState<RecentEpisodesResult | null>(null)

    const source = RECENT_EPISODES_SOURCES[getRecentEpisodesSource(locale)]

    useEffect(() => {
        const controller = new AbortController()
        const load = async () => {
            try {
                const response = await fetch(
                    `/api/recent-episodes?locale=${locale}`,
                    { signal: controller.signal }
                )
                const json: ApiResponse<RecentEpisode[]> = await response.json()
                if (!json.success || !json.data) {
                    throw new Error(json.error?.message)
                }
                setResult({ locale, episodes: json.data })
            } catch {
                if (controller.signal.aborted) return
                setResult({ locale, episodes: null })
            }
        }
        load()
        return () => controller.abort()
    }, [locale])

    const isLoading = result?.locale !== locale

    return (
        <>
            <div className="mb-6 flex items-baseline gap-3">
                <h2 className="text-lg font-semibold md:text-2xl">
                    {t('title')}
                </h2>
                <span className="text-muted-foreground text-xs uppercase">
                    {t('source', { name: source.name })}
                </span>
            </div>

            {isLoading ? (
                <RecentEpisodesSkeleton
                    imageAspect={source.imageAspect}
                    skeletonItemCount={source.pageSize}
                />
            ) : result.episodes === null ? (
                <p className="text-muted-foreground text-sm">{t('error')}</p>
            ) : (
                <ul className={RECENT_EPISODES_GRID[source.imageAspect]}>
                    {result.episodes.map((episode) => (
                        <li key={episode.id}>
                            <RecentEpisodeCard episode={episode} now={now} />
                        </li>
                    ))}
                </ul>
            )}
        </>
    )
}
