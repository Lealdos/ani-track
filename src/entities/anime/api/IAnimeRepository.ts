import type {
    Anime,
    Episode,
    Genre,
    AnimeCharacter,
    Recommendation,
    ScheduleDay,
} from '../models'
import type { PaginationInfo } from '@/types/pageInfo'

export interface IAnimeRepository {
    browse(
        query?: string
    ): Promise<{ animes: Anime[]; pagination: PaginationInfo }>
    findById(id: number): Promise<Anime | null>
    findTop(): Promise<Anime[]>
    findSeasonal(): Promise<Anime[]>
    findByGenre(genreId: number): Promise<Anime[]>
    findAiringByDay(day: ScheduleDay): Promise<Anime[]>
    findEpisodes(
        id: number,
        page?: number
    ): Promise<{ episodes: Episode[]; pagination: PaginationInfo }>
    findCharacters(id: number): Promise<AnimeCharacter[]>
    findRecommendations(id: number): Promise<Recommendation[]>
    findGenres(): Promise<Genre[]>
}
