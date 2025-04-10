import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimeList } from '@/components/anime-list';
import { getAnimeByGenre } from '@/lib/api';
import { GenreSelect } from './GenreSelect';

export async function AnimeByGenre() {
    // Popular genres
    const genres = [
        { id: 1, name: 'Action' },
        { id: 2, name: 'Adventure' },
        { id: 4, name: 'Comedy' },
        { id: 8, name: 'Drama' },
        { id: 10, name: 'Fantasy' },
    ];

    // Fetch anime for the first genre to show by default
    const defaultGenreAnimes = await getAnimeByGenre(genres[0].id);

    return (
        <Tabs defaultValue={genres[0].id.toString()} className='space-y-4'>
            <TabsList className='flex h-auto flex-wrap justify-start gap-2'>
                {genres.map((genre) => (
                    <TabsTrigger
                        key={genre.id}
                        value={genre.id.toString()}
                        className='rounded-full px-4 py-2'
                    >
                        {genre.name}
                    </TabsTrigger>
                ))}
            </TabsList>

            {genres.map((genre) => (
                <TabsContent
                    key={genre.id}
                    value={genre.id.toString()}
                    className='space-y-4'
                >
                    {genre.id === genres[0].id ? (
                        <AnimeList animes={defaultGenreAnimes} />
                    ) : (
                        <GenreSelect genreId={genre.id} />
                    )}
                </TabsContent>
            ))}
        </Tabs>
    );
}
