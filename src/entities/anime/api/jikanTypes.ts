// Internal raw types from Jikan API v4 — not exported outside this folder

import type { AnimeType } from '../models/Anime'

type JikanAnimeImagesType = {
    jpg: {
        image_url: string
        large_image_url: string
        small_image_url: string
    }
    webp?: {
        image_url: string
        large_image_url: string
        small_image_url: string
    }
}

export type JikanAnime = {
    mal_id: number
    title: string
    title_japanese?: string
    title_english?: string
    title_synonyms?: string[]
    type?: AnimeType
    episodes?: number
    status?: string
    score: number
    images?: JikanAnimeImagesType
    synopsis?: string
    genres?: { mal_id: number; name: string }[]
    aired?: { from: Date; to: Date }
    studios?: { mal_id: number; name: string; url: string }[]
    rating?: string
    duration?: string
    season?: string
    year?: number
    streaming?: { name: string; url: string }[]
    broadcast?: {
        day: string
        time: string
        timezone: string
        string: string
    }
    rank: number
    popularity?: number
    demographics: { mal_id: number; type: string; name: string; url: string }[]
    relations: {
        relation: string
        entry: { mal_id: number; type: string; name: string; url: string }[]
    }[]
    producers?: { mal_id: number; name: string; url: string; type: string }[]
    trailer?: { embed_url: string; youtube_id: string; url: string }
}

export type JikanGenre = {
    mal_id: number
    name: string
    url: string
    count: number
}

export type JikanRecommendation = {
    entry: {
        mal_id: number
        url: string
        images: JikanAnimeImagesType
        title: string
    }
}

export type JikanEpisode = {
    mal_id: number
    title: string
    title_japanese: string
    title_romanji: string
    aired: string
    filler: boolean
    recap: boolean
    forum_url: string
    url: string
}

export type JikanCharacter = {
    mal_id: number
    url: string
    images: {
        jpg: { image_url: string; small_image_url?: string }
        webp?: { image_url: string; small_image_url?: string }
    }
    name: string
}

export type JikanVoiceActor = {
    person: {
        mal_id: number
        url: string
        images: { jpg: { image_url: string } }
        name: string
    }
    language: string
}

export type JikanCharacterDataItem = {
    character: JikanCharacter
    role: string
    voice_actors: JikanVoiceActor[]
}
