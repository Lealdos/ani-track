import { searchAnime } from '@/lib/api'
import { AnimeCard } from '@/components/AnimeCard/anime-card'
import { Anime } from '@/types/anime'
import { Pagination } from '@/components/Pagination/Pagination'

interface SearchResultsProps {
    query: string
    page: number
}

export async function SearchResults({ query, page }: SearchResultsProps) {
    const data = await searchAnime(query, page)

    if (!data || !('animes' in data)) {
        return null
    }

    const { animes, pagination } = data

    if (animes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border p-8 text-center">
                <h3 className="mb-2 text-lg font-medium">No results found</h3>
                <p className="text-sm">
                    Try searching for something else or check your spelling.
                </p>
            </div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {animes.map((anime: Anime) => (
                    <AnimeCard key={anime.mal_id} anime={anime} showBadge />
                ))}
            </div>
            <Pagination
                currentPage={pagination.current_page}
                nextPage={pagination.has_next_page}
                lastPage={pagination.last_visible_page}
            />
        </>
    )
}
