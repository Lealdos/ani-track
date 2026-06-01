import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Heart } from 'lucide-react'
import { CurrentSeason } from '@/app/[locale]/(home)/components/CurrentSeason/CurrentSeason'
import { TopAnime } from '@/app/[locale]/(home)/components/topAnime/TopAnime'
import { AnimeByGenre } from '@/app/[locale]/(home)/components/GenreAnime'
import { AnimeListSkeleton } from '@/components/shared/SkeletonCard/AnimeSkeletonList'
import { EpisodeSchedule } from '@/app/[locale]/(home)/components/EpisodeSchedule/EpisodeSchedule'
import { animeRepository } from '@/entities/anime/api'

import { Hero } from './components/Hero/Hero'
import { HeroSkeleton } from './components/Hero/HeroSkeleton'

import { FavoritesAccordion } from '@/components/ui/FavoritesAccordion'
import { Link } from '@/i18n/navigation'

const siteDescription =
    'Discover seasonal, top, and genre-based anime. Track favorites, episode schedules, and what you are currently watching with AniTrack.'

export const metadata: Metadata = {
    title: 'AniTrack | Anime Discovery & Tracking',
    description: siteDescription,
    openGraph: {
        title: 'AniTrack | Anime Discovery & Tracking',
        description: siteDescription,
        url: '/',
        siteName: 'AniTrack',
        images: [
            {
                url: '/hero-sakura.jpeg',
                width: 1200,
                height: 630,
                alt: 'AniTrack — Anime Discovery & Tracking',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'AniTrack | Anime Discovery & Tracking',
        description: siteDescription,
        images: ['/hero-sakura.jpeg'],
    },
}

export default async function Home({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    setRequestLocale(locale)
    const t = await getTranslations('Home')

    const seasonalAnime = animeRepository.findSeasonal()
    const topAnime = animeRepository.findTop()

    return (
        <>
            <Suspense fallback={<HeroSkeleton />}>
                <Hero />
            </Suspense>
            <div className="max-w-8xl container mx-auto w-full px-4 py-8 text-white">
                <section className="mb-12">
                    <h2 className="flex items-center gap-2 text-2xl font-bold">
                        {t('yourFavorites')}
                        <Heart className="h-6 w-6 fill-red-600 text-red-600" />
                    </h2>
                    <FavoritesAccordion />
                </section>

                <section className="mb-12" id="schedule">
                    <EpisodeSchedule />
                </section>

                <section className="mb-12" id="season">
                    <h2 className="mb-6 text-2xl font-bold tracking-tight">
                        {t('currentSeason')}
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
                        {t('topGlobal')}
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
                        {t('animeByGenre')}
                    </Link>
                    <Suspense
                        fallback={
                            <AnimeListSkeleton sectionName="anime-by-genre" />
                        }
                    >
                        <AnimeByGenre />
                    </Suspense>
                </section>
            </div>
        </>
    )
}
