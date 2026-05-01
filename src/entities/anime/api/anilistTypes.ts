export type AniListTitle = {
    romaji: string
    english: string | null
    native: string | null
}

export type AniListCoverImage = {
    extraLarge: string | null
    large: string | null
    medium: string | null
    color: string | null
}

export type AniListDate = {
    year: number | null
    month: number | null
    day: number | null
}

export type AniListStudioNode = {
    id: number
    name: string
    siteUrl: string
    isAnimationStudio: boolean
}

export type AniListTrailer = {
    id: string | null
    site: string | null
    thumbnail: string | null
}

export type AniListExternalLink = {
    id: number
    url: string
    site: string
    type: string | null
}

export type AniListStreamingEpisode = {
    title: string | null
    thumbnail: string | null
    url: string | null
    site: string | null
}

export type AniListNextAiringEpisode = {
    airingAt: number
    timeUntilAiring: number
    episode: number
}

export type AniListRanking = {
    id: number
    rank: number
    type: string
    format: string | null
    year: number | null
    season: string | null
    allTime: boolean
    context: string
}

export type AniListTag = {
    id: number
    name: string
    rank: number
    isMediaSpoiler: boolean
}

export type AniListCharacterName = {
    full: string | null
    native: string | null
    userPreferred: string | null
}

export type AniListCharacterImage = {
    large: string | null
    medium: string | null
}

export type AniListCharacterNode = {
    id: number
    name: AniListCharacterName
    image: AniListCharacterImage
    siteUrl: string
}

export type AniListVoiceActor = {
    id: number
    name: AniListCharacterName
    image: AniListCharacterImage
    language: string
    siteUrl: string
}

export type AniListCharacterEdge = {
    id: number
    role: string
    node: AniListCharacterNode
    voiceActors: AniListVoiceActor[]
}

export type AniListRelationNode = {
    id: number
    title: AniListTitle
    type: string
    format: string | null
    siteUrl: string
}

export type AniListRelationEdge = {
    id: number
    relationType: string
    node: AniListRelationNode
}

export type AniListRecommendationNode = {
    id: number
    mediaRecommendation: {
        id: number
        title: AniListTitle
        coverImage: AniListCoverImage
        siteUrl: string
    } | null
}

export type AniListMediaFormat =
    | 'TV'
    | 'TV_SHORT'
    | 'MOVIE'
    | 'SPECIAL'
    | 'OVA'
    | 'ONA'
    | 'MUSIC'

export type AniListMediaStatus =
    | 'FINISHED'
    | 'RELEASING'
    | 'NOT_YET_RELEASED'
    | 'CANCELLED'
    | 'HIATUS'

export type AniListMedia = {
    id: number
    idMal: number | null
    title: AniListTitle
    type: string
    format: AniListMediaFormat | null
    status: AniListMediaStatus | null
    episodes: number | null
    duration: number | null
    season: string | null
    seasonYear: number | null
    averageScore: number | null
    meanScore: number | null
    popularity: number | null
    trending: number | null
    favourites: number | null
    synonyms?: string[]
    coverImage: AniListCoverImage
    bannerImage: string | null
    description: string | null
    genres: string[]
    tags?: AniListTag[]
    studios: { nodes: AniListStudioNode[] }
    startDate: AniListDate
    endDate: AniListDate
    nextAiringEpisode: AniListNextAiringEpisode | null
    trailer: AniListTrailer | null
    externalLinks: AniListExternalLink[]
    streamingEpisodes?: AniListStreamingEpisode[]
    rankings: AniListRanking[]
    recommendations?: { nodes: AniListRecommendationNode[] }
    characters?: { edges: AniListCharacterEdge[] }
    relations?: { edges: AniListRelationEdge[] }
}

export type AniListPageInfo = {
    total: number
    currentPage: number
    lastPage: number
    hasNextPage: boolean
    perPage: number
}

export type AniListPageResponse = {
    data: {
        Page: {
            pageInfo: AniListPageInfo
            media: AniListMedia[]
        }
    }
}

export type AniListMediaResponse = {
    data: {
        Media: AniListMedia
    }
}

export type AniListGenreResponse = {
    data: {
        GenreCollection: string[]
    }
}

export type AniListAiringSchedule = {
    id: number
    airingAt: number
    episode: number
    media: AniListMedia
}

export type AniListAiringScheduleResponse = {
    data: {
        Page: {
            pageInfo: AniListPageInfo
            airingSchedules: AniListAiringSchedule[]
        }
    }
}

export type AniListCharactersResponse = {
    data: {
        Media: {
            characters: { edges: AniListCharacterEdge[] }
        }
    }
}

export type AniListRecommendationsResponse = {
    data: {
        Media: {
            recommendations: { nodes: AniListRecommendationNode[] }
        }
    }
}

export type AniListStreamingEpisodesResponse = {
    data: {
        Media: {
            episodes: number | null
            streamingEpisodes: AniListStreamingEpisode[]
        }
    }
}
