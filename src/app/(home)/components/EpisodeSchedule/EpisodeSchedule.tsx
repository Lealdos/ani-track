'use client'

import { useState, useEffect } from 'react'

import type { AiringAnime } from '@/entities/anime/api/ani-list/anilistSchedule'
import type { ScheduleDay } from '@/entities/anime/models'
import { getAiringByDayAction } from '@/entities/anime/api/actions'
import { AnimeListSkeleton } from '@/components/shared/SkeletonCard/AnimeSkeletonList'
import { ScheduleAnimeCard } from './ScheduleAnimeCard'

const WEEKDAYS: ScheduleDay[] = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
]

const SCHEDULE_GRID =
    'grid grid-cols-2 justify-items-center gap-4 px-4 py-4 sm:grid-cols-3 md:overflow-visible lg:grid-cols-4 xl:grid-cols-5'

export function EpisodeSchedule(): React.ReactElement {
    const [selectedDay, setSelectedDay] = useState<ScheduleDay | null>(null)
    const [animesByDay, setAnimesByDay] = useState<AiringAnime[] | null>(null)

    const handleDayChange = async (day: ScheduleDay) => {
        if (!day) return

        setSelectedDay(day)
        setAnimesByDay(null)
        const filteredAnimesByDay = await getAiringByDayAction(day)
        setAnimesByDay(filteredAnimesByDay)
    }

    useEffect(() => {
        const todayIndex = new Date().getDay()
        const defaultDayIndex = (todayIndex + 6) % 7
        const clientDefaultDay = WEEKDAYS[defaultDayIndex]

        handleDayChange(clientDefaultDay)
    }, [])

    const isLoading = animesByDay === null

    return (
        <>
            <h2 className="text-lg font-semibold md:text-2xl">
                Emission schedule{' '}
            </h2>
            <div className="mb-6 flex gap-2 overflow-x-auto py-2">
                {WEEKDAYS.map((day) => {
                    const isActive = selectedDay === day
                    return (
                        <button
                            key={day}
                            onClick={() => handleDayChange(day)}
                            className={`rounded border border-purple-600 px-2 py-1 text-base capitalize ${isActive ? 'bg-rose-900 text-white shadow-md shadow-purple-600/70' : 'bg-transparent text-white opacity-70'} hover:bg-pink-800 hover:text-white`}
                            disabled={isActive}
                        >
                            {day}
                        </button>
                    )
                })}
            </div>

            {isLoading ? (
                <AnimeListSkeleton
                    sectionName="episode-schedule"
                    skeletonItemCount={10}
                    gridClassName={SCHEDULE_GRID}
                />
            ) : (
                <ul className={SCHEDULE_GRID}>
                    {animesByDay.map((anime) => (
                        <li
                            key={`schedule-${anime.id}-ep${anime.nextEpisode}`}
                        >
                            <ScheduleAnimeCard anime={anime} />
                        </li>
                    ))}
                </ul>
            )}
        </>
    )
}
