'use server'
import { animeRepository } from './JikanAnimeRepository'
import type { ScheduleDay } from '../models'

export async function getAnimeByGenreAction(genreId: number) {
    return animeRepository.findByGenre(genreId)
}

export async function getAiringByDayAction(day: ScheduleDay) {
    return animeRepository.findAiringByDay(day)
}
