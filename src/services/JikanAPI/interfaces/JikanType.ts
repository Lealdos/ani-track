import {
    AnimeType,
    broadcastInfo,
    multipleLanguagesTitles,
    streaming,
} from '@/types/anime'

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
    All_titles?: multipleLanguagesTitles[]
    type?: AnimeType
    episodes?: number
    status?: string
    score: number
    images?: JikanAnimeImagesType
    synopsis?: string
    genres?: { mal_id: number; name: string }[]
    aired?: {
        from: Date
        to: Date
    }
    studios?: { mal_id: number; name: string }[]
    rating?: string
    duration?: string
    season?: string
    year?: number
    streaming?: streaming[]
    broadcast?: broadcastInfo
    rank: number // for top anime
    popularity?: number 
    demographics: JikanAnimeEntry[]
    relations: relations[]
}

type relations = {
    relation: string
    entry: JikanAnimeEntry[]
}

type JikanAnimeEntry = {
    mal_id: number
    type: string
    name: string
    url: string
}
type JikanGenres = {
    mal_id: number
    name: string
    url: string
    count: number
}

export type JikanAnimeGenres = {
    data: JikanGenres[]
}

export type JikanRecommendations = {
    entry: {
        mal_id: number
        url: string
        images: JikanAnimeImagesType
        title: string
    }
}

export type JikanAnimeRecommendations = {
    data: JikanRecommendations[]
}

export type JikanAnimeEpisodes = {
    data: JikanEpisode[]
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
}

export type JikanScheduleDays = 'monday'| 'tuesday'| 'wednesday'| 'thursday'| 'friday'| 'saturday'| 'sunday'