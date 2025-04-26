import { searchAnime } from '@/lib/api'
import { AnimeCard } from '@/components/anime-card'
import { Anime } from '@/types/anime'

interface SearchResultsProps {
    query: string
}

export async function SearchResults({ query }: SearchResultsProps) {
    const animes = await searchAnime(query)
    console.log(animes)

    if (animes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <h3 className="mb-2 text-lg font-medium">No results found</h3>
                <p className="text-sm">
                    Try searching for something else or check your spelling.
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {animes.map((anime: Anime) => (
                <AnimeCard key={anime.mal_id} anime={anime} showBadge />
            ))}
        </div>
    )
}
