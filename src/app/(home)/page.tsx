import { Suspense } from 'react'
import { CurrentSeason } from '@/components/CurrentSeason/CurrentSeason'
import { TopAnime } from '@/components/topAnime/TopAnime'
import { AnimeByGenre } from '@/components/GenreAnime'
import { AnimeListSkeleton } from '@/components/SkeletonCard/AnimeSkeletonList'
import { getSeasonalAnime, getTopAnime } from '@/services/JikanAPI/jikanAnimeApi'
import { FavoritesAccordion } from '@/components/ui/FavoritesAccordion'
import { Heart } from 'lucide-react'

import { FavoriteProvider } from '@/context/favoriteContext'
import { LastAiredEpisodes } from '@/components/LastAiredEpisode/LastAiredEpisodes'

export default async function Home() {
    const seasonalAnime = getSeasonalAnime()
    const topAnime = getTopAnime()

    return (
        <FavoriteProvider>
            <div className="container mx-auto min-h-screen w-full max-w-7xl px-4 py-8 text-white">
                <section className="mb-12">
                    <h2 className="flex items-center gap-2 text-2xl font-bold">
                        Your favorites animes
                        <Heart className="h-6 w-6 fill-red-600 text-red-600" />
                    </h2>
                    <FavoritesAccordion />
                </section>

                <section className="mb-12">
                    <h2 className="flex items-center gap-2 text-2xl font-bold">
                    last episodes released:
                    </h2>
                    <LastAiredEpisodes />
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
                    <h2 className="mb-6 text-2xl font-bold">
                        Top global Anime 🌎
                    </h2>
                    <Suspense fallback={<AnimeListSkeleton />}>
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
                </section>
            </div>
        </FavoriteProvider>
    )
}
