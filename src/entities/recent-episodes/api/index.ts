import type { Locale } from '@/i18n/routing'
import { getRecentEpisodesSource, type RecentEpisode } from '../models'
import { fetchAnimeAv1RecentEpisodes } from './animeav1Scraper'
import { fetchAniwaveLatestEpisodes } from './aniwaveScraper'

export { fetchAnimeAv1RecentEpisodes, fetchAniwaveLatestEpisodes }

export function getRecentEpisodesByLocale(
    locale: Locale,
    page: number = 1
): Promise<RecentEpisode[]> {
    return getRecentEpisodesSource(locale) === 'animeav1'
        ? fetchAnimeAv1RecentEpisodes()
        : fetchAniwaveLatestEpisodes(page)
}
