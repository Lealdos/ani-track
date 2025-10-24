'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, use } from 'react'

import { JikanAnime } from '@/services/JikanAPI/interfaces/JikanType'
import { broadcastInfo } from '@/types/anime'
import { convertJSTToLocal } from '@/lib/utils/utils'

interface CurrentSeasonProps {
    currentSeason: Promise<JikanAnime[]>
}

const WEEKDAYS: broadcastInfo['day'][] = [
    'Mondays',
    'Tuesdays',
    'Wednesdays',
    'Thursdays',
    'Fridays',
    'Saturdays',
    'Sundays',
]

// console.log(WEEKDAYS_MAP)

export function EpisodeSchedule({
    currentSeason,
}: CurrentSeasonProps): React.ReactElement {
    const animeCurrentSeason = use(currentSeason)
    // 0 (Sun) - 6 (Sat)
    const todayIndex = new Date().getDay()
    const defaultDayIndex = (todayIndex + 6) % 7
    const defaultDay = WEEKDAYS[defaultDayIndex]

    const [selectedDay, setSelectedDay] = useState<string>(defaultDay)

    const [animeByDay, setAnimeByDay] = useState<JikanAnime[]>(() =>
        animeCurrentSeason.filter((anime) => {
            return anime?.broadcast?.day === selectedDay
        })
    )

    const handleDayChange = (day: string) => {
        setSelectedDay(day)
        const filteredAnimesByDay = animeCurrentSeason.filter((anime) => {
            return anime?.broadcast?.day === day
        })
        setAnimeByDay(filteredAnimesByDay)
    }

    return (
        <>
            <h2 className="text-lg font-semibold">emission schedule </h2>

            <div className="mb-6 flex gap-2 overflow-x-auto py-2">
                {WEEKDAYS.map((day: string) => {
                    const active = selectedDay === day
                    return (
                        <button
                            key={day}
                            onClick={() => handleDayChange(day)}
                            className={`rounded-md border px-3 py-1 text-sm whitespace-nowrap ${active ? 'bg-emerald-400 text-black' : 'bg-transparent text-white/80'} ${selectedDay ? '' : 'opacity-50'}`}
                        >
                            {day}
                        </button>
                    )
                })}
            </div>

            {/* Anime list grid */}

            <ul className="grid grid-cols-2 justify-items-center gap-4 px-4 py-4 sm:grid-cols-3 md:overflow-visible lg:grid-cols-4 xl:grid-cols-5">
                {animeByDay.map((anime) => (
                    <article
                        key={`last-episode-${anime.mal_id}`}
                        className="flex max-w-[200px] min-w-38 flex-col items-center justify-between overflow-hidden rounded-lg border bg-black/80 transition-all duration-400 hover:shadow-xl hover:shadow-indigo-500/60 md:h-full md:max-w-[260px] md:min-w-[220px]"
                    >
                        <Link
                            href={`/anime/${anime.mal_id}`}
                            className="flex h-full w-full flex-col"
                        >
                            <div className="relative h-70">
                                <Image
                                    src={
                                        anime.images?.jpg?.image_url ||
                                        '/placeholder.svg'
                                    }
                                    alt={`${anime.title} poster`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    className="object-fill"
                                />
                                <span className="absolute top-3 right-3 rounded-full bg-black/70 px-2 py-1 text-xs text-white">
                                    {convertJSTToLocal(anime.broadcast?.string)}{' '}
                                    ~ aprox.
                                </span>
                                <span className="absolute bottom-3 left-3 rounded bg-slate-700 px-2 py-1 text-xs text-white">
                                    TV Anime
                                </span>
                            </div>

                            <h3 className="truncate p-2 text-center text-sm font-semibold text-wrap">
                                {anime.title.length > 120
                                    ? `${anime.title.slice(0, 60)}...`
                                    : anime.title}
                            </h3>
                        </Link>
                    </article>
                ))}

                {/* If there are no animes for the selected day show a friendly message */}
                {(animeByDay ?? []).length === 0 && (
                    <div className="text-muted-foreground col-span-full py-8 text-center text-sm">
                        there are no airing animes for this day.
                    </div>
                )}
            </ul>
        </>
    )
}
