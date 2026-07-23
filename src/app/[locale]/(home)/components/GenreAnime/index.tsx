import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { useTranslations } from 'next-intl'
import { AnimeList } from '@/components/shared/AnimeList/AnimeList'
import { getAnimeByGenreAction } from '@/entities/anime/api/actions'
import { GenreSelect } from './GenreSelect'

export function AnimeByGenre() {
    const t = useTranslations('Genres.names')
    // Popular genres — `id` indexes ANILIST_GENRES (1-based, see anilistMappers.ts);
    // only the displayed label is translated.
    const genres = [
        { id: 1, labelKey: 'action' },
        { id: 2, labelKey: 'adventure' },
        { id: 3, labelKey: 'comedy' },
        { id: 4, labelKey: 'drama' },
        { id: 6, labelKey: 'fantasy' },
    ] as const

    // Fetch anime for the first genre to show by default
    const defaultGenreAnimes = getAnimeByGenreAction(genres[0].id)

    return (
        <Tabs defaultValue={genres[0].id.toString()} className="space-y-8">
            <TabsList className="bg-linear-to-tr flex h-auto max-w-full justify-between gap-2 overflow-x-auto from-slate-900/90 via-purple-900/90 to-slate-900/90 py-2 md:justify-around md:p-2">
                {genres.map((genre) => (
                    <TabsTrigger
                        key={genre.id}
                        value={genre.id.toString()}
                        className="my-1.5 rounded-full py-2 text-white data-[state=active]:bg-black data-[state=inactive]:bg-black/55"
                    >
                        {t(genre.labelKey)}
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
