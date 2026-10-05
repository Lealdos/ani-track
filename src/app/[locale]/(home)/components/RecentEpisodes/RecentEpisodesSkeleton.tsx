import type { RecentEpisode } from '@/entities/recent-episodes/models'
import {
    RECENT_EPISODES_ASPECT,
    RECENT_EPISODES_GRID,
} from './recentEpisodesGrid'

interface RecentEpisodesSkeletonProps {
    imageAspect: RecentEpisode['imageAspect']
    skeletonItemCount: number
}

// Mirrors the real grid (same columns and image aspect) so nothing jumps when
// the scraped episodes arrive.
export function RecentEpisodesSkeleton({
    imageAspect,
    skeletonItemCount,
}: RecentEpisodesSkeletonProps) {
    return (
        <ul className={RECENT_EPISODES_GRID[imageAspect]} aria-busy="true">
            {Array.from({ length: skeletonItemCount }).map((_, i) => (
                <li
                    key={`recent-episodes-${i}`}
                    className="flex flex-col gap-2"
                >
                    <div
                        className={`bg-muted/60 w-full animate-pulse rounded-lg ${RECENT_EPISODES_ASPECT[imageAspect]}`}
                    />
                    <div className="bg-muted/60 mx-auto h-4 w-3/4 animate-pulse rounded" />
                </li>
            ))}
        </ul>
    )
}
