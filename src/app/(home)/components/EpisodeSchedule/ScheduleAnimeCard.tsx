import Link from 'next/link'

import type { AiringAnime } from '@/entities/anime/api/ani-list/anilistSchedule'

function formatLocalTime(airingAt: number): string {
    const date = new Date(airingAt)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function hasAired(timeUntilAiring: number): boolean {
    return timeUntilAiring <= 0
}

function truncateTitle(title: string, max = 120): string {
    return title.length > max ? `${title.slice(0, 60)}...` : title
}

export function ScheduleAnimeCard({ anime }: { anime: AiringAnime }) {
    const aired = hasAired(anime.timeUntilAiring)

    return (
        <article className="flex max-w-[200px] min-w-38 flex-col items-center justify-between overflow-hidden rounded-2xl transition-all duration-400 hover:shadow-lg hover:shadow-indigo-600/50 md:h-full md:max-w-[260px] md:min-w-[220px]">
            <Link
                href={`/anime/${anime.id}`}
                className="flex h-full w-full flex-col"
            >
                <div className="relative h-70">
                    <img
                        src={anime.images?.jpg?.imageUrl || '/placeholder.svg'}
                        alt={`${anime.title} poster`}
                        className="object-fit h-50 max-h-90 rounded md:h-72 md:w-full md:object-center"
                    />
                    <span className="absolute top-3 right-3 rounded-full bg-black/70 px-2 py-1 text-xs text-white">
                        {formatLocalTime(anime.airingAt)}
                    </span>
                    <span className="absolute top-3 left-3 rounded-full bg-purple-900/80 px-2 py-1 text-xs text-white">
                        Ep {anime.nextEpisode}
                    </span>
                    <div className="absolute right-0 bottom-3 left-0 flex items-center justify-between px-3">
                        <span className="rounded bg-slate-700 px-2 py-1 text-xs text-white">
                            {anime.type}
                        </span>
                        <span
                            className={`rounded-full px-2 py-1 text-xs font-medium text-white ${aired ? 'bg-green-700/90' : 'bg-rose-700/90'}`}
                        >
                            {aired ? 'Aired' : 'Not aired'}
                        </span>
                    </div>
                </div>

                <h3 className="truncate p-2 text-center text-sm font-semibold text-wrap">
                    {truncateTitle(
                        anime.titleRomaji ||
                            anime.titleEnglish ||
                            anime.title ||
                            ''
                    )}
                </h3>
            </Link>
        </article>
    )
}
