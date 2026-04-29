export type AnimeType = 'tv' | 'movie' | 'ova' | 'special' | 'ona' | 'music'

type AnimeImage = {
    imageUrl: string
    largeImageUrl: string
    smallImageUrl: string
}

export type AnimeImages = {
    jpg: AnimeImage
    webp?: AnimeImage
}

export type AnimeGenre = {
    id: number
    name: string
}

export type AnimeEntry = {
    id: number
    type: string
    name: string
    url: string
}

export type AnimeRelation = {
    relation: string
    entry: AnimeEntry[]
}

export type AnimeStudio = {
    id: number
    name: string
    url: string
}

export type AnimeProducer = {
    id: number
    name: string
    url: string
    type: string
}

export type AnimeBroadcast = {
    day: string
    time: string
    timezone: string
    string: string
}

export type AnimeTrailer = {
    embedUrl: string
    youtubeId: string
    url: string
}

export type Anime = {
    id: number
    title: string
    titleEnglish?: string
    titleJapanese?: string
    titleSynonyms?: string[]
    type?: AnimeType
    episodes?: number
    status?: string
    score: number
    images?: AnimeImages
    synopsis?: string
    genres?: AnimeGenre[]
    aired?: { from: Date; to: Date }
    studios?: AnimeStudio[]
    rating?: string
    duration?: string
    season?: string
    year?: number
    streaming?: { name: string; url: string }[]
    broadcast?: AnimeBroadcast
    rank: number
    popularity?: number
    demographics: AnimeEntry[]
    relations: AnimeRelation[]
    producers?: AnimeProducer[]
    trailer?: AnimeTrailer
}

export type ListsAnimes = Pick<Anime, 'id' | 'title' | 'images'>
