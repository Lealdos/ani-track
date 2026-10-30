/* eslint-disable @next/next/no-img-element */
import { useFormatter, useTranslations } from 'next-intl'
import { Clock, Tv } from 'lucide-react'

import type { RecentEpisode } from '@/entities/recent-episodes/models'

interface RecentEpisodeCardProps {
    episode: RecentEpisode
    /** Reference time for the "x hours ago" label, shared by every card. */
    now: Date
}

// Same look as the shared AnimeCard so it fits the shared grid and skeleton.
export function RecentEpisodeCard({ episode, now }: RecentEpisodeCardProps) {
    const t = useTranslations('RecentEpisodes')
    const format = useFormatter()

    return (
        // External episode page, so a plain anchor instead of the i18n Link.
        <a
            href={episode.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shadow-soft transition-silk bg-card hover:shadow-petal group relative block overflow-hidden rounded-lg hover:-translate-y-1"
        >
            <div className="aspect-2/3 bg-muted relative overflow-hidden">
                <img
                    src={episode.image}
                    alt={`${episode.title} poster`}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="transition-silk absolute inset-0 h-full min-h-full w-full min-w-full object-cover object-center group-hover:scale-105"
                />
                <div className="bg-linear-to-t from-background via-background/30 absolute inset-0 to-transparent opacity-90" />
                {episode.episode !== null && (
                    <span className="font-display bg-background/80 text-primary absolute left-2 top-2 rounded-full px-2.5 py-0.5 text-sm font-semibold backdrop-blur">
                        {t('episodeShort', { number: episode.episode })}
                    </span>
                )}
            </div>
            <div className="absolute inset-x-0 bottom-0 p-3">
                <h3
                    className="font-display text-foreground group-hover:text-primary line-clamp-2 text-base leading-tight transition-colors md:text-lg"
                    title={episode.titleAlt ?? episode.title}
                >
                    {episode.title}
                </h3>
                <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm md:text-base">
                    {episode.type && (
                        <span className="inline-flex items-center gap-1">
                            <Tv className="h-3 w-3" />
                            {episode.type}
                        </span>
                    )}
                    {episode.publishedAt && (
                        <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format.relativeTime(
                                new Date(episode.publishedAt),
                                now
                            )}
                        </span>
                    )}
                </div>
            </div>
        </a>
    )
}
