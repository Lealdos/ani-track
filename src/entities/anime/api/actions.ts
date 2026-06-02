'use server'
import { jikanAnimeRepo } from './Jikan/JikanAnimeRepository'
import { fetchAiringByDay, type AiringAnime } from './ani-list/anilistSchedule'
import type { ScheduleDay } from '../models'

export async function getAnimeByGenreAction(genreId: number) {
    return jikanAnimeRepo.findByGenre(genreId)
}

export async function getAiringByDayAction(
    day: ScheduleDay
): Promise<AiringAnime[]> {
    return fetchAiringByDay(day)
}
