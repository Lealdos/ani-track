export const dynamic = 'force-dynamic'
import { Suspense } from 'react'
import { CurrentSeason } from '@/components/CurrentSeason/CurrentSeason'
import { TopAnime } from '@/components/topAnime/TopAnime'
import { AnimeByGenre } from '@/components/GenreAnime'
import { AnimeListSkeleton } from '@/components/SkeletonCard/AnimeSkeletonList'
import { getSeasonalAnime, getTopAnime } from '@/lib/api'
import { FavoritesAccordion } from '@/components/ui/FavoritesAccordion'

export default async function Home() {
    const seasonalAnime = getSeasonalAnime()
    const topAnime = getTopAnime()

    return (
        <div className="container mx-auto min-h-screen w-full px-4 py-8 text-white max-w-7xl">
            <section className="mb-12">
            <h2 className="flex items-center gap-2 text-2xl font-bold">
                        ❤ Your saved animes lists 
                    </h2>
                <FavoritesAccordion />
            </section>
            <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold">Top global Anime 🌎</h2>

                <TopAnime topAnime={topAnime} />
            </section>
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
