'use server'
import { anilistAnimeRepository } from './ani-list/AniListAnimeRepository'
import { fetchAiringByDay, type AiringAnime } from './ani-list/anilistSchedule'
import type { ScheduleDay } from '../models'

export async function getAnimeByGenreAction(genreId: number) {
    return anilistAnimeRepository.findByGenre(genreId)
}

export async function getAiringByDayAction(
    day: ScheduleDay
): Promise<AiringAnime[]> {
    return fetchAiringByDay(day)
}
