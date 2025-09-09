import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { AnimeList } from '@/components/AnimeList/AnimeList'
import { getAnimeByGenre } from '@/services/JikanAPI/jikanAnimeApi'
import { GenreSelect } from './GenreSelect'

export function AnimeByGenre() {
    // Popular genres
    const genres = [
        { id: 1, name: 'Action' },
        { id: 2, name: 'Adventure' },
        { id: 4, name: 'Comedy' },
        { id: 8, name: 'Drama' },
        { id: 10, name: 'Fantasy' },
    ]

    // Fetch anime for the first genre to show by default
    const defaultGenreAnimes = getAnimeByGenre(genres[0].id)

    return (
        <Tabs defaultValue={genres[0].id.toString()} className="space-y-8">
            <TabsList className="flex h-auto max-w-full justify-between gap-2 overflow-x-auto bg-gradient-to-tr from-slate-900/90 via-purple-900/90 to-slate-900/90 py-2 md:justify-around md:p-2">
                {genres.map((genre) => (
                    <TabsTrigger
                        key={genre.id}
                        value={genre.id.toString()}
                        className="my-1.5 rounded-full py-2 text-white data-[state=active]:bg-purple-600 data-[state=inactive]:bg-black/60"
                    >
                        {genre.name}
                    </TabsTrigger>
                ))}
            </TabsList>

            {genres.map((genre) => (
                <TabsContent
                    key={genre.id}
                    value={genre.id.toString()}
                    className="space-y-4"
                >
                    {genre.id === genres[0].id ? (
                        <AnimeList animes={defaultGenreAnimes} showBadge />
                    ) : (
                        <GenreSelect genreId={genre.id} />
                    )}
                </TabsContent>
            ))}
        </Tabs>
    )
}
