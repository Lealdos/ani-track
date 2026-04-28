import type {
    JikanAnime,
    JikanEpisode,
    JikanGenre,
    JikanRecommendation,
    JikanCharacterDataItem,
} from './jikanTypes'
import type {
    Anime,
    Episode,
    Genre,
    Recommendation,
    AnimeCharacter,
    StreamingPlatform,
} from '../models'

export function toAnime(raw: JikanAnime): Anime {
    return {
        id: raw.mal_id,
        title: raw.title,
        titleEnglish: raw.title_english,
        titleJapanese: raw.title_japanese,
        titleSynonyms: raw.title_synonyms,
        type: raw.type,
        episodes: raw.episodes,
        status: raw.status,
        score: raw.score,
        images: raw.images
            ? {
                  jpg: {
                      imageUrl: raw.images.jpg.image_url,
                      largeImageUrl: raw.images.jpg.large_image_url,
                      smallImageUrl: raw.images.jpg.small_image_url,
                  },
                  webp: raw.images.webp
                      ? {
                            imageUrl: raw.images.webp.image_url,
                            largeImageUrl: raw.images.webp.large_image_url,
                            smallImageUrl: raw.images.webp.small_image_url,
                        }
                      : undefined,
              }
            : undefined,
        synopsis: raw.synopsis,
        genres: raw.genres?.map((g) => ({ id: g.mal_id, name: g.name })),
        aired: raw.aired,
        studios: raw.studios?.map((s) => ({
            id: s.mal_id,
            name: s.name,
            url: s.url,
        })),
        rating: raw.rating,
        duration: raw.duration,
        season: raw.season,
        year: raw.year,
        streaming: raw.streaming,
        broadcast: raw.broadcast,
        rank: raw.rank,
        popularity: raw.popularity,
        demographics: (raw.demographics ?? []).map((d) => ({
            id: d.mal_id,
            type: d.type,
            name: d.name,
            url: d.url,
        })),
        relations: (raw.relations ?? []).map((r) => ({
            relation: r.relation,
            entry: r.entry.map((e) => ({
                id: e.mal_id,
                type: e.type,
                name: e.name,
                url: e.url,
            })),
        })),
        producers: raw.producers?.map((p) => ({
            id: p.mal_id,
            name: p.name,
            url: p.url,
            type: p.type,
        })),
        trailer: raw.trailer
            ? {
                  embedUrl: raw.trailer.embed_url,
                  youtubeId: raw.trailer.youtube_id,
                  url: raw.trailer.url,
              }
            : undefined,
    }
}

export function toEpisode(raw: JikanEpisode): Episode {
    return {
        id: raw.mal_id,
        title: raw.title,
        titleJapanese: raw.title_japanese,
        titleRomanji: raw.title_romanji,
        aired: raw.aired,
        filler: raw.filler,
        recap: raw.recap,
        forumUrl: raw.forum_url,
        url: raw.url,
    }
}

export function toGenre(raw: JikanGenre): Genre {
    return {
        id: raw.mal_id,
        name: raw.name,
        url: raw.url,
        count: raw.count,
    }
}

export function toRecommendation(raw: JikanRecommendation): Recommendation {
    return {
        entry: {
            id: raw.entry.mal_id,
            url: raw.entry.url,
            images: {
                jpg: {
                    imageUrl: raw.entry.images.jpg.image_url,
                    largeImageUrl: raw.entry.images.jpg.large_image_url,
                    smallImageUrl: raw.entry.images.jpg.small_image_url,
                },
                webp: raw.entry.images.webp
                    ? {
                          imageUrl: raw.entry.images.webp.image_url,
                          largeImageUrl: raw.entry.images.webp.large_image_url,
                          smallImageUrl: raw.entry.images.webp.small_image_url,
                      }
                    : undefined,
            },
            title: raw.entry.title,
        },
    }
}

export function toCharacter(raw: JikanCharacterDataItem): AnimeCharacter {
    return {
        character: {
            id: raw.character.mal_id,
            url: raw.character.url,
            images: {
                jpg: {
                    imageUrl: raw.character.images.jpg.image_url,
                    smallImageUrl: raw.character.images.jpg.small_image_url,
                },
                webp: raw.character.images.webp
                    ? {
                          imageUrl: raw.character.images.webp.image_url,
                          smallImageUrl:
                              raw.character.images.webp.small_image_url,
                      }
                    : undefined,
            },
            name: raw.character.name,
        },
        role: raw.role,
        voiceActors: raw.voice_actors.map((va) => ({
            person: {
                id: va.person.mal_id,
                url: va.person.url,
                images: { jpg: { imageUrl: va.person.images.jpg.image_url } },
                name: va.person.name,
            },
            language: va.language,
        })),
    }
}

export function toStreamingPlatform(link: {
    name: string
    url: string
}): StreamingPlatform {
    const name = link.name
    let logo = name.charAt(0).toUpperCase()
    let color = ''

    if (name.toLowerCase().includes('crunchyroll')) {
        color = 'bg-orange-600'
        logo = 'C'
    } else if (name.toLowerCase().includes('netflix')) {
        color = 'bg-red-600'
        logo = 'N'
    } else if (name.toLowerCase().includes('hulu')) {
        color = 'bg-green-600'
        logo = 'H'
    } else if (name.toLowerCase().includes('amazon')) {
        color = 'bg-blue-600'
        logo = 'A'
    } else if (name.toLowerCase().includes('funimation')) {
        color = 'bg-purple-600'
        logo = 'F'
    } else {
        color = 'bg-blue-800'
    }

    return {
        name,
        logo,
        url: link.url,
        color,
        subscription: 'Subscription required',
        price: 'Varies by region',
    }
}
