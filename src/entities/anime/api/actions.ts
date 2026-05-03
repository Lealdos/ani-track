'use server'
import { animeRepository } from './JikanAnimeRepository'
import { fetchAiringByDay, type AiringAnime } from './anilistSchedule'
import type { ScheduleDay } from '../models'

export async function getAnimeByGenreAction(genreId: number) {
    return animeRepository.findByGenre(genreId)
}

export async function getAiringByDayAction(
    day: ScheduleDay
): Promise<AiringAnime[]> {
    return fetchAiringByDay(day)
}
