'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

import {
    JikanAnime,
    JikanScheduleDays,
} from '@/services/JikanAPI/interfaces/JikanType'
import { convertJSTToLocal } from '@/lib/utils'
import { getAiringDayAnime } from '@/services/JikanAPI/jikanAnimeApi'
import { AnimeListSkeleton } from '@/components/shared/SkeletonCard/AnimeSkeletonList'
import { cn } from '@/lib/utils'

const WEEKDAYS: JikanScheduleDays[] = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
]

const WEEKDAY_LABELS: Record<JikanScheduleDays, string> = {
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    sunday: 'Sun',
}

export function EpisodeSchedule(): React.ReactElement {
    const [selectedDay, setSelectedDay] = useState<JikanScheduleDays | null>(null)
    const [animesByDay, setAnimesByDay] = useState<JikanAnime[] | []>([])

    const handleDayChange = async (day: JikanScheduleDays) => {
        if (!day) return
        setSelectedDay(day)
        setAnimesByDay([])
        const filteredAnimesByDay = await getAiringDayAnime(day)
        setAnimesByDay(filteredAnimesByDay)
    }

    useEffect(() => {
        const todayIndex = new Date().getDay()
        const defaultDayIndex = (todayIndex + 6) % 7
        const clientDefaultDay = WEEKDAYS[defaultDayIndex]
        handleDayChange(clientDefaultDay)
    }, [])

    if (selectedDay === null) {
        return (
            <AnimeListSkeleton
                sectionName="episode-schedule"
                skeletonItemCount={5}
            />
        )
    }

    return (
        <div className="space-y-6">
            {/* Day Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {WEEKDAYS.map((day) => {
                    const isSelected = selectedDay === day
                    const todayIndex = new Date().getDay()
                    const dayIndex = WEEKDAYS.indexOf(day)
                    const isToday = dayIndex === (todayIndex + 6) % 7
                    
                    return (
                        <button
                            key={day}
                            onClick={() => handleDayChange(day)}
                            disabled={isSelected}
                            className={cn(
                                'relative flex flex-col items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 min-w-[64px]',
                                isSelected
                                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                                    : 'bg-card border border-border/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
                            )}
                        >
                            <span className="capitalize">{WEEKDAY_LABELS[day]}</span>
                            {isToday && (
                                <span className={cn(
                                    'text-[10px] mt-0.5',
                                    isSelected ? 'text-primary-foreground/80' : 'text-primary'
                                )}>
                                    Today
                                </span>
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Anime Grid */}
            {animesByDay.length > 0 ? (
                <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {animesByDay.map((anime) => (
                        <article
                            key={`last-episode-${anime.mal_id}`}
                            className="anime-card group relative overflow-hidden rounded-xl bg-card border border-border/50"
                        >
                            <Link
                                href={`/anime/${anime.mal_id}`}
                                className="flex flex-col"
                            >
                                <div className="relative aspect-[2/3] w-full overflow-hidden">
                                    <img
                                        src={anime.images?.jpg?.image_url || '/placeholder.svg'}
                                        alt={`${anime.title} poster`}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                                    
                                    {/* Time Badge */}
                                    <div className="absolute top-2 right-2 rounded-lg bg-background/90 backdrop-blur-sm px-2 py-1 text-[10px] font-medium text-foreground">
                                        {convertJSTToLocal(anime.broadcast?.string)}
                                    </div>
                                    
                                    {/* Type Badge */}
                                    <div className="absolute bottom-2 left-2 rounded-md bg-primary/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
                                        {anime.type}
                                    </div>
                                </div>

                                <div className="p-3">
                                    <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
                                        {anime.title}
                                    </h3>
                                </div>
                            </Link>
                        </article>
                    ))}
                </ul>
            ) : (
                <AnimeListSkeleton
                    sectionName="episode-schedule"
                    skeletonItemCount={5}
                />
            )}
        </div>
    )
}
