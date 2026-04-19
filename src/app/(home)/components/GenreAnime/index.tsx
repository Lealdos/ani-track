import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { AnimeList } from '@/components/shared/AnimeList/AnimeList'
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
        <Tabs defaultValue={genres[0].id.toString()} className="space-y-6">
            <TabsList className="flex h-auto max-w-full gap-2 overflow-x-auto bg-transparent p-0 scrollbar-none">
                {genres.map((genre) => (
                    <TabsTrigger
                        key={genre.id}
                        value={genre.id.toString()}
                        className="rounded-lg border border-border/50 bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 hover:bg-secondary/50"
                    >
                        {genre.name}
                    </TabsTrigger>
                ))}
            </TabsList>

            {genres.map((genre) => (
                <TabsContent
                    key={genre.id}
                    value={genre.id.toString()}
                    className="mt-0"
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
