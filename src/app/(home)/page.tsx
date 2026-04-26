import { Suspense } from 'react'
import { cacheLife } from 'next/cache'

import { Heart } from 'lucide-react'
import { CurrentSeason } from '@/app/(home)/components/CurrentSeason/CurrentSeason'
import { TopAnime } from '@/app/(home)/components/topAnime/TopAnime'
import { AnimeByGenre } from '@/app/(home)/components/GenreAnime'
import { AnimeListSkeleton } from '@/components/shared/SkeletonCard/AnimeSkeletonList'
import { EpisodeSchedule } from '@/app/(home)/components/EpisodeSchedule/EpisodeSchedule'
import {
    getSeasonalAnime,
    getTopAnime,
} from '@/services/JikanAPI/jikanAnimeApi'

import { Hero } from './components/Hero/Hero'

import { FavoritesAccordion } from '@/components/ui/FavoritesAccordion'
import Link from 'next/link'

export default async function Home() {
    'use cache'
    cacheLife('weeks') // Cache this page for 2 week
    const seasonalAnime = getSeasonalAnime()
    const topAnime = getTopAnime()

    return (
        <>
            <Suspense fallback={null}>
                <Hero />
            </Suspense>
            <div className="max-w-8xl container mx-auto w-full px-4 py-8 text-white">
                <section className="mb-12">
                    <h2 className="flex items-center gap-2 text-2xl font-bold">
                        Your favorites animes
                        <Heart className="h-6 w-6 fill-red-600 text-red-600" />
                    </h2>
                    <FavoritesAccordion />
                </section>

                <section className="mb-12" id="schedule">
                    <EpisodeSchedule />
                </section>

                <section className="mb-12" id="season">
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
                <section className="mb-12" id="global-top">
                    <h2 className="mb-6 text-2xl font-bold">
                        Top global Anime 🌎
                    </h2>
                    <Suspense fallback={<AnimeListSkeleton />}>
                        <TopAnime topAnime={topAnime} />
                    </Suspense>
                </section>

                <section className="mb-12">
                    <Link
                        href="/anime/genres"
                        className="mb-6 text-2xl font-bold tracking-tight"
                    >
                        Anime by Genre
                    </Link>
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
                    <span>
                        Animes that you have added to your watch later list.
                        Coming soon!
                    </span>
                </section>
            </div>
        </>
    )
}
