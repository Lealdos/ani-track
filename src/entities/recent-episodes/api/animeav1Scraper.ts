import { cacheLife, cacheTag } from 'next/cache'
import { unflatten } from 'devalue'
import { z } from 'zod'

import { createAppError } from '@/lib/utils/errors'
import type { RecentEpisode } from '../models'
import { scraperFetch } from './scraperFetch'
import { RECENT_EPISODES_CACHE_LIFE } from './utils'

const ANIMEAV1_BASE_URL = 'https://animeav1.com'
const ANIMEAV1_CDN_URL = 'https://cdn.animeav1.com'
// SvelteKit exposes the page `load` data at `__data.json`, serialized with devalue.
const ANIMEAV1_HOME_DATA_URL = `${ANIMEAV1_BASE_URL}/__data.json?x-sveltekit-invalidated=001`

type SvelteKitNode = { type: string; data?: unknown[] }
type SvelteKitDataResponse = { type: string; nodes?: (SvelteKitNode | null)[] }

const latestEpisodesSchema = z.object({
    latestEpisodes: z.array(
        z.object({
            id: z.number(),
            number: z.number(),
            publishedAt: z.string().nullish(),
            media: z.object({
                id: z.number(),
                slug: z.string(),
                title: z.string(),
            }),
        })
    ),
})

type AnimeAv1Episode = z.infer<
    typeof latestEpisodesSchema
>['latestEpisodes'][number]

// Postgres timestamp "2026-09-26 22:04:08.493+00" → ISO string.
function toIsoDate(timestamp: string | null | undefined): string | null {
    if (!timestamp) return null
    const date = new Date(
        timestamp.replace(' ', 'T').replace(/([+-]\d{2})$/, '$1:00')
    )
    return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

function toRecentEpisode(episode: AnimeAv1Episode): RecentEpisode {
    return {
        id: `animeav1-${episode.media.id}-${episode.number}`,
        source: 'animeav1',
        title: episode.media.title,
        titleAlt: null,
        episode: episode.number,
        url: `${ANIMEAV1_BASE_URL}/media/${episode.media.slug}/${episode.number}`,
        // The site builds the thumbnail from the media id, the payload has no image field.
        image: `${ANIMEAV1_CDN_URL}/thumbnails/${episode.media.id}.jpg`,
        imageAspect: 'landscape',
        publishedAt: toIsoDate(episode.publishedAt),
        type: null,
    }
}

/** "Episodios · Recientemente Actualizado" section of animeav1.com (20 items, no pagination). */
export async function fetchAnimeAv1RecentEpisodes(): Promise<RecentEpisode[]> {
    'use cache'
    cacheLife(RECENT_EPISODES_CACHE_LIFE)
    cacheTag('recent-episodes-animeav1')

    const json = await scraperFetch<SvelteKitDataResponse>(
        ANIMEAV1_HOME_DATA_URL
    )

    // Find the node by content instead of its index, layout nodes may change.
    const homeNode = json.nodes?.find((node) => {
        const root = node?.type === 'data' ? node.data?.[0] : undefined
        return (
            typeof root === 'object' &&
            root !== null &&
            'latestEpisodes' in root
        )
    })

    const parsed = latestEpisodesSchema.safeParse(
        homeNode?.data ? unflatten(homeNode.data) : undefined
    )
    if (!parsed.success) {
        throw createAppError('AnimeAV1 response has an unexpected shape', {
            statusCode: 502,
            code: 'UPSTREAM_PARSE_ERROR',
        })
    }

    return parsed.data.latestEpisodes.map(toRecentEpisode)
}
