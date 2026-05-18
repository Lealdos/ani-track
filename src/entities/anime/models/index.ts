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
    ListsAnimes,
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

/** Minimal stored shape persisted in user lists (favorites, custom lists, etc.). */
export type StoredAnimeListItem = {
    animeId: string
    title: string
    picture: string
}

/**
 * Projects a stored list item back into the {@link Anime} entity so it can be
 * rendered by components that expect the full Anime shape (e.g. AnimeCard).
 */
export function animeFromListItem(item: StoredAnimeListItem): Anime {
    const picture = item.picture || '/placeholder.svg'
    return {
        id: Number(item.animeId),
        title: item.title,
        score: 0,
        rank: 0,
        demographics: [],
        relations: [],
        images: {
            jpg: {
                imageUrl: picture,
                largeImageUrl: picture,
                smallImageUrl: picture,
            },
        },
    }
}
