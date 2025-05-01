import Link from 'next/link'
import { Play, Calendar } from 'lucide-react'

interface Episode {
    mal_id: number
    title: string
    aired?: string
}

interface EpisodeListProps {
    episodes: Episode[]
    animeId: string
}

export function EpisodeList({ episodes, animeId }: EpisodeListProps) {
    if (!episodes || episodes.length === 0) {
        return (
            <div className="py-8 text-center text-gray-400">
                No hay información de episodios disponible para este anime.
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">
                    Episodios ({episodes.length})
                </h3>
                {episodes.length > 10 && (
                    <button className="text-xs">Ver todos los episodios</button>
                )}
            </div>

            <div className="space-y-2">
                {episodes.slice(0, 10).map((episode) => (
                    <Link
                        key={episode.mal_id}
                        href={`/anime/${animeId}/watch/${episode.mal_id}`}
                        className="block"
                    >
                        <div className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900 p-3 transition-colors hover:bg-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-900">
                                    <Play className="h-4 w-4" />
                                </div>
                                <div>
                                    <div className="line-clamp-1 font-medium">
                                        Episodio {episode.mal_id}:{' '}
                                        {episode.title}
                                    </div>
                                    {episode.aired && (
                                        <div className="mt-1 flex items-center text-xs text-gray-400">
                                            <Calendar className="mr-1 h-3 w-3" />
                                            {new Date(
                                                episode.aired
                                            ).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button className="rounded bg-purple-600 p-2 hover:bg-purple-700">
                                Watch
                            </button>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
