/* eslint-disable @next/next/no-img-element */
import { useFormatter, useTranslations } from 'next-intl'

import type { RecentEpisode } from '@/entities/recent-episodes/models'
import { RECENT_EPISODES_ASPECT } from './recentEpisodesGrid'

interface RecentEpisodeCardProps {
    episode: RecentEpisode
    /** Reference time for the "x hours ago" badge, shared by every card. */
    now: Date
}

export function RecentEpisodeCard({ episode, now }: RecentEpisodeCardProps) {
    const t = useTranslations('RecentEpisodes')
    const format = useFormatter()

    return (
        <article className="duration-400 h-full overflow-hidden rounded-2xl transition-all hover:shadow-lg hover:shadow-indigo-600/50">
            {/* External episode page, so a plain anchor instead of the i18n Link. */}
            <a
                href={episode.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full w-full flex-col"
            >
                <div
                    className={`relative w-full overflow-hidden rounded ${RECENT_EPISODES_ASPECT[episode.imageAspect]}`}
                >
                    <img
                        src={episode.image}
                        alt={`${episode.title} thumbnail`}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover object-center"
                    />
                    {episode.episode !== null && (
                        <span className="absolute left-3 top-3 rounded-full bg-purple-900/80 px-2 py-1 text-xs text-white">
                            {t('episodeShort', { number: episode.episode })}
                        </span>
                    )}
                    {episode.publishedAt && (
                        <span className="absolute right-3 top-3 rounded-full bg-black/70 px-2 py-1 text-xs text-white">
                            {format.relativeTime(
                                new Date(episode.publishedAt),
                                now
                            )}
                        </span>
                    )}
                    {episode.type && (
                        <span className="absolute bottom-3 left-3 rounded bg-violet-900/90 px-2 py-1 text-xs text-white">
                            {episode.type}
                        </span>
                    )}
                </div>

                <h3
                    className="m-2 line-clamp-2 text-center text-sm font-semibold"
                    title={episode.titleAlt ?? episode.title}
                >
                    {episode.title}
                </h3>
            </a>
        </article>
    )
}
