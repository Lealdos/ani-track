import type { Anime, ScheduleDay } from '../models'

export type AiringAnime = Anime & {
    airingAt: number
    timeUntilAiring: number
    nextEpisode: number
}

const ANILIST_API = 'https://graphql.anilist.co'

const AIRING_SCHEDULE_QUERY = `
query ($airingAtGreater: Int, $airingAtLesser: Int, $page: Int) {
  Page(page: $page, perPage: 50) {
    airingSchedules(
      airingAt_greater: $airingAtGreater
      airingAt_lesser: $airingAtLesser
      sort: TIME
    ) {
      airingAt
      timeUntilAiring
      episode
      media {   
        isAdult
        idMal
        title {
          romaji
          english
          native
        }
        format
        episodes
        status
        averageScore
        coverImage {
          extraLarge
          large
          medium
        }
        genres
        season
        seasonYear
        duration
        type
      }
    }
  }
}
`

type AniListMedia = {
    idMal: number | null
    isAdult: boolean
    title: { romaji: string; english: string | null; native: string | null }
    format: string | null
    episodes: number | null
    status: string | null
    averageScore: number | null
    coverImage: {
        extraLarge: string | null
        large: string | null
        medium: string | null
    } | null
    genres: string[] | null
    season: string | null
    seasonYear: number | null
    duration: number | null
    type: string | null
}

type AniListAiringSchedule = {
    airingAt: number
    timeUntilAiring: number
    episode: number
    media: AniListMedia
}

type AniListResponse = {
    data: {
        Page: {
            airingSchedules: AniListAiringSchedule[]
        }
    }
}

const DAY_INDEX: Record<ScheduleDay, number> = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sunday: 0,
}

function getDayTimestamps(day: ScheduleDay): {
    start: number
    end: number
} {
    const now = new Date()
    const currentDayIndex = now.getDay()
    const targetDayIndex = DAY_INDEX[day]

    let diff = targetDayIndex - currentDayIndex
    if (diff < -3) diff += 7
    if (diff > 3) diff -= 7

    const target = new Date(now)
    target.setDate(now.getDate() + diff)
    target.setHours(0, 0, 0, 0)

    const start = Math.floor(target.getTime() / 1000)
    const end = start + 86400

    return { start, end }
}

const FORMAT_MAP: Record<string, string> = {
    TV: 'TV',
    TV_SHORT: 'TV Short',
    MOVIE: 'Movie',
    SPECIAL: 'Special',
    OVA: 'OVA',
    ONA: 'ONA',
    MUSIC: 'Music',
}

function toAnimeFromAniList(
    schedule: AniListAiringSchedule
): AiringAnime | null {
    const media = schedule.media
    if (!media.idMal || media.isAdult) return null

    const airingDate = new Date(schedule.airingAt * 1000)
    const days = [
        'Sundays',
        'Mondays',
        'Tuesdays',
        'Wednesdays',
        'Thursdays',
        'Fridays',
        'Saturdays',
    ]
    const hours = airingDate.getUTCHours().toString().padStart(2, '0')
    const minutes = airingDate.getUTCMinutes().toString().padStart(2, '0')
    const jstHours = ((airingDate.getUTCHours() + 9) % 24)
        .toString()
        .padStart(2, '0')
    const jstMinutes = airingDate.getUTCMinutes().toString().padStart(2, '0')

    const broadcastString = `${days[airingDate.getUTCDay()]} at ${jstHours}:${jstMinutes} (JST)`

    const imageUrl =
        media.coverImage?.extraLarge ??
        media.coverImage?.large ??
        media.coverImage?.medium ??
        ''

    return {
        id: media.idMal,
        title: media.title.english ?? media.title.romaji ?? '',
        titleEnglish: media.title.english ?? undefined,
        titleJapanese: media.title.native ?? undefined,
        titleRomaji: media.title.romaji ?? undefined,
        type: (FORMAT_MAP[media.format ?? ''] ??
            media.format ??
            undefined) as Anime['type'],
        episodes: media.episodes ?? undefined,
        status: media.status ?? undefined,
        score: (media.averageScore ?? 0) / 10,
        images: {
            jpg: {
                imageUrl,
                largeImageUrl: imageUrl,
                smallImageUrl: media.coverImage?.medium ?? imageUrl,
            },
        },
        genres: media.genres?.map((g, i) => ({ id: i, name: g })),
        season: media.season?.toLowerCase(),
        year: media.seasonYear ?? undefined,
        broadcast: {
            day: days[airingDate.getUTCDay()],
            time: `${hours}:${minutes}`,
            timezone: 'JST',
            string: broadcastString,
        },
        rank: 0,
        demographics: [],
        relations: [],
        duration: media.duration ? `${media.duration} min per ep` : undefined,
        airingAt: schedule.airingAt,
        timeUntilAiring: schedule.timeUntilAiring,
        nextEpisode: schedule.episode,
    }
}

export async function fetchAiringByDay(
    day: ScheduleDay
): Promise<AiringAnime[]> {
    const { start, end } = getDayTimestamps(day)

    const response = await fetch(ANILIST_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: AIRING_SCHEDULE_QUERY,
            variables: {
                airingAtGreater: start,
                airingAtLesser: end,
                page: 1,
            },
        }),
    })

    if (!response.ok) {
        throw new Error(
            `AniList API error: ${response.status} ${response.statusText}`
        )
    }

    const json: AniListResponse = await response.json()
    const schedules = json.data.Page.airingSchedules

    const seen = new Set<number>()
    const animes: AiringAnime[] = []

    for (const schedule of schedules) {
        const anime = toAnimeFromAniList(schedule)
        if (!anime || seen.has(anime.id)) continue
        seen.add(anime.id)
        animes.push(anime)
    }

    return animes.sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
}
