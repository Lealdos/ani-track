import { cacheLife, cacheTag } from 'next/cache'
import { load } from 'cheerio'

import { createAppError } from '@/lib/utils/errors'
import type { RecentEpisode } from '../models'
import { scraperFetch } from './scraperFetch'
import { RECENT_EPISODES_CACHE_LIFE } from './utils'

const ANIWAVE_BASE_URL = 'https://aniwaves.ru'

// Same widget the "Latest Episode" tabs on /home use. `result` is an HTML fragment.
type AniwaveWidgetResponse = { status?: number; result?: string }

function parseEpisodeNumber(text: string): number | null {
    const value = Number.parseInt(text.trim(), 10)
    return Number.isNaN(value) ? null : value
}

/** "Latest Episode" section of aniwaves.ru/home (12 items per page). */
export async function fetchAniwaveLatestEpisodes(
    page: number = 1
): Promise<RecentEpisode[]> {
    'use cache'
    cacheLife(RECENT_EPISODES_CACHE_LIFE)
    cacheTag('recent-episodes-aniwave')

    const json = await scraperFetch<AniwaveWidgetResponse>(
        `${ANIWAVE_BASE_URL}/ajax/home/widget/updated?page=${page}`
    )
    if (typeof json.result !== 'string') {
        throw createAppError('AniWave response has an unexpected shape', {
            statusCode: 502,
            code: 'UPSTREAM_PARSE_ERROR',
        })
    }

    const $ = load(json.result)
    const episodes: RecentEpisode[] = []

    $('.ani.items > .item').each((_, element) => {
        const item = $(element)
        const nameLink = item.find('.info a.name').first()
        const title = nameLink.text().trim()
        const href =
            nameLink.attr('href') ?? item.find('.poster a').attr('href')
        if (!title || !href) return

        const seriesUrl = new URL(href, ANIWAVE_BASE_URL).toString()
        const animeId =
            item.find('.ani.poster').attr('data-tip') ?? href.split('-').pop()
        // Only the subbed episode is used, the dub count is ignored on purpose.
        const episode = parseEpisodeNumber(
            item.find('.poster .ep-status.sub span').first().text()
        )

        episodes.push({
            id: `aniwave-${animeId}-${episode ?? 'na'}`,
            source: 'aniwave',
            title,
            titleAlt: nameLink.attr('data-jp')?.trim() || null,
            episode,
            url: episode ? `${seriesUrl}/ep-${episode}` : seriesUrl,
            image: item.find('.poster img').attr('src') || '/placeholder.svg',
            imageAspect: 'portrait',
            publishedAt: null,
            type:
                item.find('.poster .meta .right').first().text().trim() || null,
        })
    })

    return episodes
}
