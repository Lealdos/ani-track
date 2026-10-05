export type RecentEpisodeSource = 'animeav1' | 'aniwave'

/** Latest released episode scraped from an external streaming site. */
export interface RecentEpisode {
    /** `${source}-${animeId}-${episode}` */
    id: string
    source: RecentEpisodeSource
    title: string
    /** Romaji title (AniWave `data-jp`), null when the source doesn't provide one. */
    titleAlt: string | null
    /** AniWave only reports the latest subbed episode. */
    episode: number | null
    /** Absolute URL to the episode on the source site. */
    url: string
    image: string
    /** AnimeAV1 thumbnails are 16:9 backdrops, AniWave uses portrait posters. */
    imageAspect: 'landscape' | 'portrait'
    /** ISO date, AnimeAV1 only. */
    publishedAt: string | null
    /** TV / ONA / ..., AniWave only. */
    type: string | null
}

/** Display info per source, safe to use on the client. */
export const RECENT_EPISODES_SOURCES = {
    animeav1: { name: 'AnimeAV1', imageAspect: 'landscape', pageSize: 20 },
    aniwave: { name: 'AniWave', imageAspect: 'portrait', pageSize: 12 },
} as const satisfies Record<
    RecentEpisodeSource,
    {
        name: string
        imageAspect: RecentEpisode['imageAspect']
        pageSize: number
    }
>

/** Spanish users get AnimeAV1, everyone else gets AniWave. */
export function getRecentEpisodesSource(locale: string): RecentEpisodeSource {
    return locale === 'es' ? 'animeav1' : 'aniwave'
}
