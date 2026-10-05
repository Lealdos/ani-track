import type { RecentEpisode } from '@/entities/recent-episodes/models'

// Landscape thumbnails (AnimeAV1) need wider cards than portrait posters (AniWave).
export const RECENT_EPISODES_GRID: Record<
    RecentEpisode['imageAspect'],
    string
> = {
    landscape:
        'grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
    portrait:
        'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6',
}

export const RECENT_EPISODES_ASPECT: Record<
    RecentEpisode['imageAspect'],
    string
> = {
    landscape: 'aspect-video',
    portrait: 'aspect-2/3',
}
