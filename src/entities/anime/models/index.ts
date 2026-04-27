export type {
    Anime,
    AnimeType,
    AnimeImages,
    AnimeGenre,
    AnimeEntry,
    AnimeRelation,
    AnimeStudio,
    AnimeProducer,
    AnimeBroadcast,
    AnimeTrailer,
} from './Anime'
export type { Episode } from './Episode'
export type { Genre } from './Genre'
export type { AnimeCharacter } from './Character'
export type { Recommendation, RecommendationEntry } from './Recommendation'
export type { StreamingPlatform } from './StreamingPlatform'
export type { ScheduleDay } from './ScheduleDay'

import type { Anime } from './Anime'

/** Returns the best available image URL for an anime. */
export function imgOf(anime: Anime): string {
    return (
        anime.images?.webp?.largeImageUrl ||
        anime.images?.jpg?.largeImageUrl ||
        anime.images?.webp?.imageUrl ||
        anime.images?.jpg?.imageUrl ||
        '/placeholder.svg'
    )
}
