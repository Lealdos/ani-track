import { Suspense } from 'react';
import { CurrentSeason } from '@/components/current-season';
import { TopAnime } from '@/components/top-anime';
import { AnimeByGenre } from '@/components/anime-by-genre';
import { SearchBar } from '@/components/search-bar';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
    return (
        <div className='container mx-auto px-4 py-8'>
            <div className='mb-8 md:hidden'>
                fdf
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

function AnimeListSkeleton() {
    return (
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
            {Array(5)
                .fill(0)
                .map((_, i) => (
                    <div key={i} className='space-y-2'>
                        <Skeleton className='h-[250px] w-full rounded-md' />
                        <Skeleton className='h-4 w-full' />
                        <Skeleton className='h-4 w-2/3' />
                    </div>
                ))}
        </div>
    );
}
