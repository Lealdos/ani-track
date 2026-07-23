import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

import type { AiringAnime } from '@/entities/anime/api/ani-list/anilistSchedule'

// AniList returns `airingAt` as a Unix timestamp in seconds.
function formatLocalTime(airingAt: number): string {
    const date = new Date(airingAt * 1000)
    // Runs client-side, so it renders in the visitor's browser timezone.
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Computed live against the current time instead of the API's fetch-time
// snapshot, so the badge stays correct as the browser tab stays open.
function hasAired(airingAt: number): boolean {
    return airingAt * 1000 <= Date.now()
}

function truncateTitle(title: string, max = 120): string {
    return title.length > max ? `${title.slice(0, 60)}...` : title
}

export function ScheduleAnimeCard({ anime }: { anime: AiringAnime }) {
    const t = useTranslations('Schedule')
    const aired = hasAired(anime.airingAt)

    return (
        <article className="max-w-50 min-w-38 duration-400 md:max-w-65 md:min-w-55 flex flex-col items-center justify-between overflow-hidden rounded-2xl transition-all hover:shadow-lg hover:shadow-indigo-600/50 md:h-full">
            <Link
                href={`/anime/${anime.id}`}
                className="flex h-full w-full flex-col"
            >
                <div className="h-70 relative">
                    <img
                        src={anime.images?.jpg?.imageUrl || '/placeholder.svg'}
                        alt={`${anime.title} poster`}
                        className="object-fit h-50 max-h-90 rounded md:h-72 md:w-full md:object-center"
                    />
                    <span className="absolute right-3 top-3 rounded-full bg-black/70 px-2 py-1 text-xs text-white">
                        {formatLocalTime(anime.airingAt)}
                    </span>
                    <span className="absolute left-3 top-3 rounded-full bg-purple-900/80 px-2 py-1 text-xs text-white">
                        {t('episodeShort', { number: anime.nextEpisode })}
                    </span>
                    <div className="absolute bottom-3 left-0 right-0 flex items-center justify-between px-3">
                        <span className="rounded bg-violet-900/90 px-2 py-1 text-xs text-white">
                            {anime.type}
                        </span>
                        <span
                            className={`rounded-full px-2 py-1 text-xs font-medium text-white ${aired ? 'bg-green-700/90' : 'bg-rose-700/90'}`}
                        >
                            {aired ? t('aired') : t('notAired')}
                        </span>
                    </div>
                </div>

                <h3 className="truncate text-wrap p-2 text-center text-sm font-semibold">
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
