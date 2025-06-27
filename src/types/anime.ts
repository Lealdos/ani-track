export type Anime = {
    mal_id: number
    title: string
    title_japanese?: string
    title_english?: string
    title_synonyms?: string[]
    All_titles?: multipleLanguagesTitles[]
    type?: AnimeType
    episodes?: number
    status?: string
    score?: number
    images?: {
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
    rank?: number // for top anime
    popularity?: number // for top anime
}

export type streaming = {
    name: string
    url: string
}

export type broadcastInfo = {
    day:
        | 'Monday'
        | 'Tuesday'
        | 'Wednesday'
        | 'Thursday'
        | 'Friday'
        | 'Saturday'
        | 'Sunday'
    time: string
    timezone: string
    string: string
}

export type multipleLanguagesTitles = {
    type: 'Japanese' | 'English' | 'Spanish' | 'French' | 'German'

    title: string
}


type AnimeType = 'tv' | 'movie' | 'ova' | 'special' | 'ona' | 'music'