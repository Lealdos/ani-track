import type { AnimeImages } from './Anime'

export type RecommendationEntry = {
    id: number
    url: string
    images: AnimeImages
    title: string
}

export type Recommendation = {
    entry: RecommendationEntry
}
