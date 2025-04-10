import { Suspense } from 'react';
import { CurrentSeason } from '@/components/current-season';
import { TopAnime } from '@/components/top-anime';
import { AnimeByGenre } from '@/components/GenreAnime';
import { SearchBar } from '@/components/search-bar';
import { AnimeListSkeleton } from '@/components/ui/AnimeSkeleton/AnimeSkeleton';

export default function Home() {
    return (
        <div className='container mx-auto px-4 py-8'>
            <div className='mb-8 md:hidden'>
                <SearchBar />
            </div>

            <section className='mb-12'>
                <h2 className='mb-6 text-2xl font-bold tracking-tight'>
                    Current Season
                </h2>
                <Suspense fallback={<AnimeListSkeleton />}>
                    <CurrentSeason />
                </Suspense>
            </section>

            <section className='mb-12'>
                <h2 className='mb-6 text-2xl font-bold tracking-tight'>
                    Top Anime
                </h2>
                <Suspense fallback={<AnimeListSkeleton />}>
                    <TopAnime />
                </Suspense>
            </section>

            <section className='mb-12'>
                <h2 className='mb-6 text-2xl font-bold tracking-tight'>
                    Anime by Genre
                </h2>
                <Suspense fallback={<AnimeListSkeleton />}>
                    <AnimeByGenre />
                </Suspense>
            </section>

            <section className='mb-12'>
                <h2 className='mb-6 text-2xl font-bold tracking-tight'>
                    Watch Later
                </h2>
                <h2>Coming soon mirar luego</h2>
            </section>
        </div>
    );
}
