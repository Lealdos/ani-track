import { NextRequest } from 'next/server'
import { hasLocale } from 'next-intl'
import { z } from 'zod'

import { successResponse, handleError } from '@/lib/utils/apiResponse'
import { routing, type Locale } from '@/i18n/routing'
import {
    fetchAnimeAv1RecentEpisodes,
    fetchAniwaveLatestEpisodes,
    getRecentEpisodesByLocale,
} from '@/entities/recent-episodes/api'
import { getRecentEpisodesSource } from '@/entities/recent-episodes/models'

const pageSchema = z.coerce.number().int().min(1).max(50).default(1)

const byLocaleQuerySchema = z.object({
    locale: z.enum(routing.locales).optional(),
    page: pageSchema,
})

// `/api` is excluded from the next-intl proxy, so the locale comes from the
// query string, then the locale cookie, then the app default.
function resolveLocale(request: NextRequest, locale?: Locale): Locale {
    if (locale) return locale
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
    return hasLocale(routing.locales, cookieLocale)
        ? cookieLocale
        : routing.defaultLocale
}

export class RecentEpisodesController {
    /** BFF: picks the source from the user's locale. */
    static async getByLocale(request: NextRequest) {
        try {
            const { searchParams } = request.nextUrl
            const query = byLocaleQuerySchema.parse({
                locale: searchParams.get('locale') ?? undefined,
                page: searchParams.get('page') ?? undefined,
            })
            const locale = resolveLocale(request, query.locale)
            const episodes = await getRecentEpisodesByLocale(locale, query.page)
            return successResponse(episodes, 200, {
                source: getRecentEpisodesSource(locale),
                locale,
                page: query.page,
            })
        } catch (error) {
            return handleError(error)
        }
    }

    static async getAnimeAv1() {
        try {
            const episodes = await fetchAnimeAv1RecentEpisodes()
            return successResponse(episodes, 200, { source: 'animeav1' })
        } catch (error) {
            return handleError(error)
        }
    }

    static async getAniwave(request: NextRequest) {
        try {
            const page = pageSchema.parse(
                request.nextUrl.searchParams.get('page') ?? undefined
            )
            const episodes = await fetchAniwaveLatestEpisodes(page)
            return successResponse(episodes, 200, { source: 'aniwave', page })
        } catch (error) {
            return handleError(error)
        }
    }
}
