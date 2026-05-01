import type {
    AniListMedia,
    AniListCharacterEdge,
    AniListRecommendationNode,
    AniListStreamingEpisode,
    AniListDate,
    AniListNextAiringEpisode,
} from './anilistTypes'
import type {
    Anime,
    Episode,
    Genre,
    AnimeCharacter,
    Recommendation,
    ScheduleDay,
} from '../models'
import type { AnimeType } from '../models/Anime'

const ANILIST_GENRES = [
    'Action',
    'Adventure',
    'Comedy',
    'Drama',
    'Ecchi',
    'Fantasy',
    'Horror',
    'Mahou Shoujo',
    'Mecha',
    'Music',
    'Mystery',
    'Psychological',
    'Romance',
    'Sci-Fi',
    'Slice of Life',
    'Sports',
    'Supernatural',
    'Thriller',
] as const

export function genreNameToId(name: string): number {
    const idx = ANILIST_GENRES.indexOf(name as (typeof ANILIST_GENRES)[number])
    return idx >= 0 ? idx + 1 : 0
}

export function genreIdToName(id: number): string | undefined {
    return ANILIST_GENRES[id - 1]
}

const FORMAT_MAP: Record<string, AnimeType> = {
    TV: 'tv',
    TV_SHORT: 'tv',
    MOVIE: 'movie',
    SPECIAL: 'special',
    OVA: 'ova',
    ONA: 'ona',
    MUSIC: 'music',
}

const STATUS_MAP: Record<string, string> = {
    FINISHED: 'Finished Airing',
    RELEASING: 'Currently Airing',
    NOT_YET_RELEASED: 'Not yet aired',
    CANCELLED: 'Cancelled',
    HIATUS: 'On Hiatus',
}

function toDate(date: AniListDate): Date {
    if (!date.year) return new Date()
    return new Date(date.year, (date.month ?? 1) - 1, date.day ?? 1)
}

function deriveBroadcast(
    nextAiring: AniListNextAiringEpisode | null | undefined
) {
    if (!nextAiring) return undefined
    const d = new Date(nextAiring.airingAt * 1000)
    const days = [
        'Sundays',
        'Mondays',
        'Tuesdays',
        'Wednesdays',
        'Thursdays',
        'Fridays',
        'Saturdays',
    ]
    const hh = d.getUTCHours().toString().padStart(2, '0')
    const mm = d.getUTCMinutes().toString().padStart(2, '0')
    return {
        day: days[d.getUTCDay()],
        time: `${hh}:${mm}`,
        timezone: 'UTC',
        string: `${days[d.getUTCDay()]} at ${hh}:${mm} (UTC)`,
    }
}

function stripHtml(html: string): string {
    return html
        .replaceAll(/<br\s*\/?>/gi, '\n')
        .replaceAll(/<[^>]*>/g, '')
        .replaceAll('&amp;', '&')
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>')
        .replaceAll('&quot;', '"')
        .replaceAll('&#039;', "'")
}

export function toAnimeFromAniList(raw: AniListMedia): Anime {
    const coverImage = raw.coverImage
    const ratedRank =
        raw.rankings?.find((r) => r.type === 'RATED' && r.allTime)?.rank ?? 0
    const popularityRank = raw.rankings?.find(
        (r) => r.type === 'POPULAR' && r.allTime
    )?.rank

    return {
        id: raw.id,
        title: raw.title.romaji,
        titleEnglish: raw.title.english ?? undefined,
        titleJapanese: raw.title.native ?? undefined,
        titleSynonyms: raw.synonyms?.length ? raw.synonyms : undefined,
        type: raw.format ? FORMAT_MAP[raw.format] : undefined,
        episodes: raw.episodes ?? undefined,
        status: raw.status ? STATUS_MAP[raw.status] : undefined,
        score: raw.averageScore ? raw.averageScore / 10 : 0,
        images: coverImage
            ? {
                  jpg: {
                      imageUrl: coverImage.large ?? '',
                      largeImageUrl:
                          coverImage.extraLarge ?? coverImage.large ?? '',
                      smallImageUrl: coverImage.medium ?? '',
                  },
              }
            : undefined,
        synopsis: raw.description ? stripHtml(raw.description) : undefined,
        genres: raw.genres?.map((g) => ({ id: genreNameToId(g), name: g })),
        aired: {
            from: toDate(raw.startDate),
            to: toDate(raw.endDate),
        },
        studios: raw.studios?.nodes
            ?.filter((s) => s.isAnimationStudio)
            .map((s) => ({ id: s.id, name: s.name, url: s.siteUrl })),
        rating: undefined,
        duration: raw.duration ? `${raw.duration} min per ep` : undefined,
        season: raw.season?.toLowerCase(),
        year: raw.seasonYear ?? undefined,
        streaming: raw.externalLinks
            ?.filter((link) => link.type === 'STREAMING')
            .map((link) => ({ name: link.site, url: link.url })),
        broadcast: deriveBroadcast(raw.nextAiringEpisode),
        rank: ratedRank,
        popularity: popularityRank ?? raw.popularity ?? undefined,
        demographics: [],
        relations: (raw.relations?.edges ?? []).map((edge) => ({
            relation: edge.relationType.replaceAll('_', ' '),
            entry: [
                {
                    id: edge.node.id,
                    type: edge.node.type,
                    name: edge.node.title.english ?? edge.node.title.romaji,
                    url: edge.node.siteUrl,
                },
            ],
        })),
        producers: raw.studios?.nodes
            ?.filter((s) => !s.isAnimationStudio)
            .map((s) => ({
                id: s.id,
                name: s.name,
                url: s.siteUrl,
                type: 'Producer',
            })),
        trailer:
            raw.trailer?.id && raw.trailer?.site === 'youtube'
                ? {
                      youtubeId: raw.trailer.id,
                      url: `https://www.youtube.com/watch?v=${raw.trailer.id}`,
                      embedUrl: `https://www.youtube.com/embed/${raw.trailer.id}`,
                  }
                : undefined,
    }
}

export function toCharacterFromAniList(
    edge: AniListCharacterEdge
): AnimeCharacter {
    return {
        character: {
            id: edge.node.id,
            url: edge.node.siteUrl,
            images: {
                jpg: {
                    imageUrl:
                        edge.node.image.large ?? edge.node.image.medium ?? '',
                    smallImageUrl: edge.node.image.medium ?? undefined,
                },
            },
            name:
                edge.node.name.userPreferred ?? edge.node.name.full ?? '',
        },
        role: edge.role,
        voiceActors: edge.voiceActors.map((va) => ({
            person: {
                id: va.id,
                url: va.siteUrl,
                images: {
                    jpg: {
                        imageUrl: va.image.large ?? va.image.medium ?? '',
                    },
                },
                name: va.name.userPreferred ?? va.name.full ?? '',
            },
            language: va.language,
        })),
    }
}

export function toRecommendationFromAniList(
    node: AniListRecommendationNode
): Recommendation | null {
    if (!node.mediaRecommendation) return null
    const rec = node.mediaRecommendation
    return {
        entry: {
            id: rec.id,
            url: rec.siteUrl,
            images: {
                jpg: {
                    imageUrl: rec.coverImage.large ?? '',
                    largeImageUrl:
                        rec.coverImage.extraLarge ?? rec.coverImage.large ?? '',
                    smallImageUrl: rec.coverImage.medium ?? '',
                },
            },
            title: rec.title.english ?? rec.title.romaji,
        },
    }
}

export function toEpisodeFromStreaming(
    ep: AniListStreamingEpisode,
    index: number
): Episode {
    return {
        id: index + 1,
        title: ep.title ?? `Episode ${index + 1}`,
        titleJapanese: '',
        titleRomanji: '',
        aired: '',
        filler: false,
        recap: false,
        forumUrl: '',
        url: ep.url ?? '',
    }
}

export function toGenreFromAniList(name: string): Genre {
    return {
        id: genreNameToId(name),
        name,
        url: `https://anilist.co/search/anime?genres=${encodeURIComponent(name)}`,
        count: 0,
    }
}

export function getCurrentSeason(): { season: string; year: number } {
    const now = new Date()
    const month = now.getMonth() + 1
    const year = now.getFullYear()
    if (month <= 3) return { season: 'WINTER', year }
    if (month <= 6) return { season: 'SPRING', year }
    if (month <= 9) return { season: 'SUMMER', year }
    return { season: 'FALL', year }
}

export function getDayBounds(day: ScheduleDay): {
    start: number
    end: number
} {
    const dayMap: Record<ScheduleDay, number> = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
    }
    const now = new Date()
    const currentDay = now.getUTCDay()
    const targetDay = dayMap[day]
    let diff = targetDay - currentDay
    if (diff < 0) diff += 7

    const target = new Date(
        Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate() + diff,
            0,
            0,
            0,
            0
        )
    )
    const start = Math.floor(target.getTime() / 1000)
    const end = start + 86400
    return { start, end }
}
