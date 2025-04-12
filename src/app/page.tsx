import { Suspense } from 'react'
import { CurrentSeason } from '@/components/current-season'
import { TopAnime } from '@/components/top-anime'
import { AnimeByGenre } from '@/components/GenreAnime'
import { SearchBar } from '@/components/search-bar'
import { AnimeListSkeleton } from '@/components/ui/SkeletonCard/AnimeSkeletonList'

export default function Home() {
    return (
        <div className="container mx-auto min-h-screen w-full px-4 py-8 text-white">
            <div className="mb-8 md:hidden">
                <SearchBar />
            </div>

            <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold tracking-tight">
                    Current Season
                </h2>
                <Suspense
                    fallback={
                        <AnimeListSkeleton sectionName="current-season" />
                    }
                >
                    {/* <CurrentSeason /> */}
                    <AnimeListSkeleton sectionName="current-season" />
                </Suspense>
            </section>

            <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold tracking-tight">
                    Top Anime
                </h2>
                <Suspense
                    fallback={<AnimeListSkeleton sectionName="top-anime" />}
                >
                    <TopAnime />
                </Suspense>
            </section>

            <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold tracking-tight">
                    Anime by Genre
                </h2>
                <Suspense
                    fallback={
                        <AnimeListSkeleton sectionName="anime-by-genre" />
                    }
                >
                    <AnimeByGenre />
                </Suspense>
            </section>

            <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold tracking-tight">
                    Watch Later
                </h2>
                <h2>Coming soon mirar luego</h2>
            </section>
        </div>
    )
}
