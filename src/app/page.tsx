export const dynamic = 'force-dynamic'
import { Suspense } from 'react'
import { CurrentSeason } from '@/components/CurrentSeason/CurrentSeason'
import { TopAnime } from '@/components/topAnime/TopAnime'
import { AnimeByGenre } from '@/components/GenreAnime'
import { AnimeListSkeleton } from '@/components/ui/SkeletonCard/AnimeSkeletonList'
import { getSeasonalAnime, getTopAnime } from '@/lib/api'

export default async function Home() {
    const seasonalAnime = getSeasonalAnime()
    const topAnime = getTopAnime()

    return (
        <div className="container mx-auto min-h-screen w-full px-4 py-8 text-white">
            <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold tracking-tight">
                    Current Season
                </h2>
                <Suspense
                    fallback={
                        <AnimeListSkeleton sectionName="current-season" />
                    }
                >
                    <CurrentSeason currentSeason={seasonalAnime} />
                </Suspense>
            </section>

            <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold tracking-tight">
                    Top Anime
                </h2>
                <Suspense
                    fallback={<AnimeListSkeleton sectionName="top-anime" />}
                >
                    <TopAnime topAnime={topAnime} />
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
