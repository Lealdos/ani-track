import { Suspense } from 'react'
import { cacheLife } from 'next/cache'

import { CurrentSeason } from '@/app/(home)/components/CurrentSeason/CurrentSeason'
import { TopAnime } from '@/app/(home)/components/topAnime/TopAnime'
import { AnimeByGenre } from '@/app/(home)/components/GenreAnime'
import { AnimeListSkeleton } from '@/components/shared/SkeletonCard/AnimeSkeletonList'
import {
    getSeasonalAnime,
    getTopAnime,
} from '@/services/JikanAPI/jikanAnimeApi'
import { FavoritesAccordion } from '@/components/ui/FavoritesAccordion'
import { Heart, Sparkles, Trophy, Clock, Layers } from 'lucide-react'

import { FavoriteProvider } from '@/context/favoriteContext'
import { EpisodeSchedule } from '@/app/(home)/components/EpisodeSchedule/EpisodeSchedule'

export default async function Home() {
    'use cache'
    cacheLife('weeks')
    const seasonalAnime = getSeasonalAnime()
    const topAnime = getTopAnime()

    return (
        <FavoriteProvider>
            <div className="container mx-auto min-h-screen w-full max-w-7xl px-4 py-8">
                {/* Hero Section */}
                <section className="mb-16 text-center">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
                        Your Anime Journey Starts Here
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Track your favorite anime, discover new series, and never miss an episode.
                    </p>
                </section>

                {/* Favorites Section */}
                <section className="mb-14">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 border border-accent/20">
                            <Heart className="size-5 text-accent" />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-foreground">
                                Your Favorites
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Quick access to your favorite anime
                            </p>
                        </div>
                    </div>
                    <FavoritesAccordion />
                </section>

                {/* Episode Schedule Section */}
                <section className="mb-14">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 border border-primary/20">
                            <Clock className="size-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-foreground">
                                Episode Schedule
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Latest episodes releasing today
                            </p>
                        </div>
                    </div>
                    <EpisodeSchedule />
                </section>

                {/* Current Season Section */}
                <section className="mb-14">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 border border-primary/20">
                            <Sparkles className="size-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-foreground">
                                Current Season
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Trending anime this season
                            </p>
                        </div>
                    </div>
                    <Suspense fallback={<AnimeListSkeleton sectionName="current-season" />}>
                        <CurrentSeason currentSeason={seasonalAnime} />
                    </Suspense>
                </section>

                {/* Top Anime Section */}
                <section className="mb-14">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <Trophy className="size-5 text-amber-500" />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-foreground">
                                Top Rated Anime
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Highest rated anime of all time
                            </p>
                        </div>
                    </div>
                    <Suspense fallback={<AnimeListSkeleton />}>
                        <TopAnime topAnime={topAnime} />
                    </Suspense>
                </section>

                {/* Anime by Genre Section */}
                <section className="mb-14">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 border border-primary/20">
                            <Layers className="size-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-foreground">
                                Browse by Genre
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Explore anime by your favorite genres
                            </p>
                        </div>
                    </div>
                    <Suspense fallback={<AnimeListSkeleton sectionName="anime-by-genre" />}>
                        <AnimeByGenre />
                    </Suspense>
                </section>

                {/* Watch Later Section */}
                <section className="mb-14">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-secondary border border-border">
                            <Clock className="size-5 text-muted-foreground" />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-foreground">
                                Watch Later
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Anime you&apos;ve saved to watch later
                            </p>
                        </div>
                    </div>
                    <div className="rounded-xl border border-dashed border-border/60 bg-card/50 p-8 text-center">
                        <p className="text-muted-foreground">
                            Coming soon! Save anime to your watch later list.
                        </p>
                    </div>
                </section>
            </div>
        </FavoriteProvider>
    )
}
