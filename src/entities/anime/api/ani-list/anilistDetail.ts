import { cache } from 'react'
import type {
    Anime,
    AnimeCharacter,
    AnimeRelation,
    Recommendation,
} from '../../models'
import { DAY } from '../utils'

const ANILIST_API = 'https://graphql.anilist.co'

const ANIME_DETAIL_QUERY = `
query ($idMal: Int) {
  Media(idMal: $idMal, type: ANIME) {
    id
    idMal
    title {
      romaji
      english
      native
    }
    format
    episodes
    status
    description(asHtml: false)
    averageScore
    popularity
    rankings {
      rank
      type
      allTime
    }
    coverImage {
      extraLarge
      large
      medium
    }
    bannerImage
    genres
    season
    seasonYear
    duration
    studios(sort: FAVOURITES_DESC) {
      edges {
        isMain
        node {
          id
          name
          siteUrl
        }
      }
    }
    startDate { year month day }
    endDate { year month day }
    trailer { id site }
    externalLinks {
      url
      site
      type
    }
    relations {
      edges {
        relationType
        node {
          id
          idMal
          title { romaji english }
          format
          type
        }
      }
    }
    recommendations(sort: RATING_DESC, perPage: 10) {
      nodes {
        mediaRecommendation {
          id
          idMal
          title { romaji english }
          coverImage { extraLarge large medium }
        }
      }
    }
    characters(sort: [ROLE, FAVOURITES_DESC], perPage: 25) {
      edges {
        role
        node {
          id
          name { full native }
          image { large medium }
        }
        voiceActors(language: JAPANESE) {
          id
          name { full native }
          image { large medium }
          languageV2
        }
      }
    }
    nextAiringEpisode {
      airingAt
      episode
    }
  }
}
`

type AniListDate = {
    year: number | null
    month: number | null
    day: number | null
} | null

type AniListMedia = {
    id: number
    idMal: number | null
    title: {
        romaji: string
        english: string | null
        native: string | null
    }

    format: string | null
    episodes: number | null
    status: string | null
    description: string | null
    averageScore: number | null
    popularity: number | null
    rankings: Array<{ rank: number; type: string; allTime: boolean }>
    coverImage: {
        extraLarge: string | null
        large: string | null
        medium: string | null
    } | null
    bannerImage: string | null
    genres: string[]
    season: string | null
    seasonYear: number | null
    duration: number | null
    studios: {
        edges: Array<{
            isMain: boolean
            node: { id: number; name: string; siteUrl: string }
        }>
    }
    startDate: AniListDate
    endDate?: AniListDate
    trailer: { id: string; site: string } | null
    externalLinks: Array<{ url: string; site: string; type: string }>
    relations: {
        edges: Array<{
            relationType: string
            node: {
                id: number
                idMal: number | null
                title: { romaji: string; english: string | null }
                format: string | null
                type: string
            }
        }>
    }
    recommendations: {
        nodes: Array<{
            mediaRecommendation: {
                id: number
                idMal: number | null
                title: { romaji: string; english: string | null }
                coverImage: {
                    extraLarge: string | null
                    large: string | null
                    medium: string | null
                } | null
            } | null
        }>
    }
    characters: {
        edges: Array<{
            role: string
            node: {
                id: number
                name: { full: string; native: string | null }
                image: { large: string | null; medium: string | null }
            }
            voiceActors: Array<{
                id: number
                name: { full: string; native: string | null }
                image: { large: string | null; medium: string | null }
                languageV2: string
            }>
        }>
    }
    nextAiringEpisode: { airingAt: number; episode: number } | null
}

export type AnimeDetailResult = {
    anime: Anime
    recommendations: Recommendation[]
    characters: AnimeCharacter[]
}

const STATUS_MAP: Record<string, string> = {
    FINISHED: 'Finished Airing',
    RELEASING: 'Currently Airing',
    NOT_YET_RELEASED: 'Not yet aired',
    CANCELLED: 'Cancelled',
    HIATUS: 'On Hiatus',
}

const FORMAT_MAP: Record<string, Anime['type']> = {
    TV: 'tv',
    TV_SHORT: 'tv',
    MOVIE: 'movie',
    SPECIAL: 'special',
    OVA: 'ova',
    ONA: 'ona',
    MUSIC: 'music',
}

const RELATION_MAP: Record<string, string> = {
    ADAPTATION: 'Adaptation',
    PREQUEL: 'Prequel',
    SEQUEL: 'Sequel',
    SIDE_STORY: 'Side story',
    PARENT: 'Parent story',
    SUMMARY: 'Summary',
    ALTERNATIVE: 'Alternative',
    SPIN_OFF: 'Spin Off',
    OTHER: 'Other',
    SOURCE: 'Source',
    CHARACTER: 'Character',
    COMPILATION: 'Compilation',
    CONTAINS: 'Contains',
}

function toDate(d: AniListDate): Date | null {
    if (!d?.year) return null
    return new Date(d.year, (d.month ?? 1) - 1, d.day ?? 1)
}

function imgUrl(cover: AniListMedia['coverImage']): string {
    return cover?.extraLarge ?? cover?.large ?? cover?.medium ?? ''
}

function mapAnime(media: AniListMedia): Anime {
    const image = imgUrl(media.coverImage)
    const smallImage = media.coverImage?.medium ?? image

    const ranked = media.rankings?.find((r) => r.type === 'RATED' && r.allTime)

    let broadcast: Anime['broadcast'] = undefined
    if (media.nextAiringEpisode) {
        const d = new Date(media.nextAiringEpisode.airingAt * 1000)
        const days = [
            'Sundays',
            'Mondays',
            'Tuesdays',
            'Wednesdays',
            'Thursdays',
            'Fridays',
            'Saturdays',
        ]
        const jstH = ((d.getUTCHours() + 9) % 24).toString().padStart(2, '0')
        const jstM = d.getUTCMinutes().toString().padStart(2, '0')
        broadcast = {
            day: days[d.getUTCDay()],
            time: `${jstH}:${jstM}`,
            timezone: 'JST',
            string: `${days[d.getUTCDay()]} at ${jstH}:${jstM} (JST)`,
        }
    }

    let trailer: Anime['trailer'] = undefined
    if (media.trailer?.site === 'youtube' && media.trailer.id) {
        trailer = {
            youtubeId: media.trailer.id,
            embedUrl: `https://www.youtube.com/embed/${media.trailer.id}`,
            url: `https://www.youtube.com/watch?v=${media.trailer.id}`,
        }
    }

    const relationsMap = new Map<string, AnimeRelation>()
    for (const edge of media.relations.edges) {
        const label = RELATION_MAP[edge.relationType] ?? edge.relationType
        const entryId = edge.node.idMal ?? edge.node.id
        const entry = {
            id: entryId,
            type: edge.node.type?.toLowerCase() ?? 'anime',
            name: edge.node.title.english ?? edge.node.title.romaji,
            url: `/anime/${entryId}`,
        }
        const existing = relationsMap.get(label)
        if (existing) {
            existing.entry.push(entry)
        } else {
            relationsMap.set(label, { relation: label, entry: [entry] })
        }
    }

    const streaming = media.externalLinks
        ?.filter((l) => l.type === 'STREAMING')
        .map((l) => ({ name: l.site, url: l.url }))

    const startDate = toDate(media.startDate)
    const endDate = toDate(media.endDate ?? null)

    return {
        id: media.idMal ?? media.id,
        title:
            media.title.english ??
            media.title.romaji ??
            media.title.native ??
            '',
        titleEnglish: media.title.english ?? undefined,
        titleJapanese: media.title.native ?? undefined,
        titleRomaji: media.title.romaji ?? undefined,
        type: FORMAT_MAP[media.format ?? ''] ?? undefined,
        episodes: media.episodes ?? undefined,
        status: STATUS_MAP[media.status ?? ''] ?? media.status ?? undefined,
        score: (media.averageScore ?? 0) / 10,
        images: {
            jpg: {
                imageUrl: image,
                largeImageUrl: image,
                smallImageUrl: smallImage,
            },
        },
        bannerImage: media.bannerImage ?? undefined,
        synopsis: media.description ?? undefined,
        genres: media.genres.map((g, i) => ({ id: i, name: g })),
        aired:
            startDate && endDate ? { from: startDate, to: endDate } : undefined,
        studios: media.studios.edges
            .filter((e) => e.isMain)
            .map((e) => ({
                id: e.node.id,
                name: e.node.name,
                url: e.node.siteUrl,
            })),
        duration: media.duration ? `${media.duration} min per ep` : undefined,
        season: media.season?.toLowerCase(),
        year: media.seasonYear ?? undefined,
        streaming,
        broadcast,
        rank: ranked?.rank ?? 0,
        popularity: media.popularity ?? undefined,
        demographics: [],
        relations: Array.from(relationsMap.values()),
        producers: media.studios.edges
            .filter((e) => !e.isMain)
            .map((e) => ({
                id: e.node.id,
                name: e.node.name,
                url: e.node.siteUrl,
                type: 'Producer',
            })),
        trailer,
    }
}

function mapRecommendations(media: AniListMedia): Recommendation[] {
    return media.recommendations.nodes
        .filter(
            (
                n
            ): n is {
                mediaRecommendation: Exclude<typeof n.mediaRecommendation, null>
            } => n.mediaRecommendation != null
        )
        .map((n) => {
            const animeRecommendation = n.mediaRecommendation
            const img = imgUrl(animeRecommendation.coverImage)
            const small = animeRecommendation.coverImage?.medium ?? img
            return {
                entry: {
                    id: animeRecommendation.idMal ?? animeRecommendation.id,
                    url: `/anime/${animeRecommendation.idMal ?? animeRecommendation.id}`,
                    images: {
                        jpg: {
                            imageUrl: img,
                            largeImageUrl: img,
                            smallImageUrl: small,
                        },
                    },
                    title:
                        animeRecommendation.title.romaji ??
                        animeRecommendation.title.english,
                },
            }
        })
}

const ROLE_MAP: Record<string, string> = {
    MAIN: 'Main',
    SUPPORTING: 'Supporting',
    BACKGROUND: 'Background',
}

function mapCharacters(media: AniListMedia): AnimeCharacter[] {
    return media.characters.edges.map((edge) => ({
        character: {
            id: edge.node.id,
            url: `https://anilist.co/character/${edge.node.id}`,
            images: {
                jpg: {
                    imageUrl:
                        edge.node.image.large ?? edge.node.image.medium ?? '',
                    smallImageUrl: edge.node.image.medium ?? undefined,
                },
            },
            name: edge.node.name.full,
        },
        role: ROLE_MAP[edge.role] ?? edge.role,
        voiceActors: edge.voiceActors.map((va) => ({
            person: {
                id: va.id,
                url: `https://anilist.co/staff/${va.id}`,
                images: {
                    jpg: {
                        imageUrl: va.image.large ?? va.image.medium ?? '',
                    },
                },
                name: va.name.full,
            },
            language: va.languageV2 ?? 'Japanese',
        })),
    }))
}

export const fetchAnimeDetailByMalId = cache(
    async (malId: number): Promise<AnimeDetailResult | null> => {
        try {
            const response = await fetch(ANILIST_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: ANIME_DETAIL_QUERY,
                    variables: { idMal: malId },
                }),
                next: { revalidate: DAY },
            })

            if (!response.ok) {
                console.error(`AniList API error: ${response.status}`)
                return null
            }

            const json = await response.json()
            const media: AniListMedia | undefined = json.data?.Media
            if (!media) return null

            return {
                anime: mapAnime(media),
                recommendations: mapRecommendations(media),
                characters: mapCharacters(media),
            }
        } catch (error) {
            console.error(
                `Error fetching anime from AniList (malId: ${malId}):`,
                error
            )
            return null
        }
    }
)
