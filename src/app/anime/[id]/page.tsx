/* eslint-disable @next/next/no-img-element */
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
    Star,
    Clock,
    BookmarkPlus,
    Video,
    House,
    Target,
    CalendarSearch,
    Hourglass,
    CalendarCheck,
    CalendarDays,
    Trophy,
    Warehouse,
} from 'lucide-react'
import { StreamingPlatforms } from '@/app/anime/[id]/components/streamingPlatforms/StreamingPlatforms'
import { EpisodesList } from '@/app/anime/[id]/components/EpisodeList/EpisodeList'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'

import {
    getAnimeById,
    getAnimeRecommendations,
    formatStreamingPlatforms,
    getAnimeCharacters,
} from '@/services/JikanAPI/jikanAnimeApi'
import { JikanRecommendations } from '@/services/JikanAPI/interfaces/JikanType'
import { formatDate } from '@/lib/utils'
import { BackButton } from '@/components/shared/BackButton/BackButton'
import { AddFavoritesButton } from '@/components/ui/AddToFavoritesListButton'
import { FavoriteProvider } from '@/context/favoriteContext'
import { convertJSTToLocal } from '@/lib/utils'
import { CharactersList } from './components/CharactersList/CharactersList'
import { AddToListButton } from '@/components/shared/AddToListButton/AddToListButton'

interface PageParams {
    id: number
}

export async function generateMetadata({
    params,
}: {
    params: Promise<PageParams>
}) {
    const { id } = await params
    const anime = await getAnimeById(id)

    if (!anime) {
        return {
            title: 'Anime Not Found',
        }
    }

    return {
        title: `AniTrack | ${anime.title}`,
        description: anime.synopsis,
    }
}

const relationsLabel = {
    adaptation: 'Adaptation',
    prequel: 'Prequel',
    sequel: 'Sequel',
    side_story: 'Side story',
    parent_story: 'Parent story',
    summary: 'Summary',
    full: 'Full',
}

export default async function AnimePage({
    params,
}: {
    params: Promise<PageParams>
}) {
    const tabsContents = [
        {
            tabsName: 'Where to watch',
        },
        { tabsName: 'Episodes' },
    ]
    const { id } = await params

    // Fetch anime details from API
    const animeData = await getAnimeById(id)
    if (!animeData) return null

    const { duration: episodeDuration, ...anime } = animeData

    const recommendations = await getAnimeRecommendations(id)

    const streamingServices = await formatStreamingPlatforms(anime?.streaming)

    const characters = await getAnimeCharacters(id)
    if (!anime) {
        return notFound()
    }

    return (
        <FavoriteProvider>
            {/* background image in mobile view */}
            <div className="min-h-screen text-foreground">
                <div className="relative h-[300px] md:hidden md:h-[620px]">
                    <img
                        src={
                            anime.images?.jpg?.large_image_url ||
                            anime.images?.jpg?.image_url ||
                            '/placeholder.svg'
                        }
                        alt={anime.title}
                        className="object-cover brightness-50"
                        sizes="(max-width: 768px) 100vw, 250px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                    <BackButton />
                </div>
                <main className="container mx-auto max-w-7xl px-4 py-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-[280px_1fr]">
                        <div className="relative mx-auto -mt-16 md:mx-0 md:mt-0">
                            <img
                                src={
                                    anime.images?.webp?.image_url ||
                                    '/placeholder.svg'
                                }
                                alt={anime.title}
                                className="aspect-2/3 rounded-xl object-cover shadow-2xl shadow-primary/20 border border-border/50"
                            />
                        </div>
                        <div className="flex flex-col">
                            {/* ANIME INFORMATION */}
                            <section>
                                <h1 className="mb-2 font-gothic text-3xl md:text-4xl text-foreground">
                                    {anime.title}
                                </h1>
                                {anime.title_english && (
                                    <p className="mb-4 text-muted-foreground">
                                        {anime.title_english}
                                    </p>
                                )}

                                <div className="mb-4 flex flex-wrap gap-2">
                                    {anime.genres?.map((genre) => (
                                        <span
                                            key={genre.mal_id}
                                            className="rounded-lg bg-secondary border border-border/50 px-3 py-1 text-sm text-muted-foreground"
                                        >
                                            {genre.name}
                                        </span>
                                    ))}
                                </div>

                                {/* Stats Grid */}
                                <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {anime.score && (
                                        <div className="flex items-center gap-2 rounded-lg bg-card border border-border/50 px-3 py-2">
                                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                            <span className="text-sm font-medium">{anime.score}/10</span>
                                        </div>
                                    )}
                                    {anime.rank && (
                                        <div className="flex items-center gap-2 rounded-lg bg-card border border-border/50 px-3 py-2">
                                            <Trophy className="h-4 w-4 text-primary" />
                                            <span className="text-sm">Rank #{anime.rank}</span>
                                        </div>
                                    )}
                                    {anime.episodes && (
                                        <div className="flex items-center gap-2 rounded-lg bg-card border border-border/50 px-3 py-2">
                                            <Video className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{anime.episodes} episodes</span>
                                        </div>
                                    )}
                                    {episodeDuration && (
                                        <div className="flex items-center gap-2 rounded-lg bg-card border border-border/50 px-3 py-2">
                                            <Hourglass className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{episodeDuration}</span>
                                        </div>
                                    )}
                                    {anime.status && (
                                        <div className="flex items-center gap-2 rounded-lg bg-card border border-border/50 px-3 py-2">
                                            <CalendarSearch className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{anime.status}</span>
                                        </div>
                                    )}
                                    {anime.season && anime.year && (
                                        <div className="flex items-center gap-2 rounded-lg bg-card border border-border/50 px-3 py-2">
                                            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm capitalize">{anime.season} {anime.year}</span>
                                        </div>
                                    )}
                                    {anime.broadcast?.string && (
                                        <div className="flex items-center gap-2 rounded-lg bg-card border border-border/50 px-3 py-2 col-span-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{convertJSTToLocal(anime.broadcast.string)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Studio & Demographics */}
                                <div className="mb-6 flex flex-wrap items-center gap-4 text-sm">
                                    {anime.studios && anime.studios.length > 0 && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <House className="h-4 w-4" />
                                            <span>Studio:</span>
                                            {anime.studios.map((studio) => (
                                                <a
                                                    key={studio.mal_id}
                                                    href={studio.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline"
                                                >
                                                    {studio.name}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                    {anime.demographics && anime.demographics.length > 0 && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Target className="h-4 w-4" />
                                            <span>Demographics:</span>
                                            {anime.demographics.map((demo) => (
                                                <span key={demo.mal_id} className="text-foreground">{demo.name}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {/* Action Buttons */}
                                <div className="mb-6 flex flex-row items-center gap-3">
                                    <AddToListButton anime={anime} />
                                    <AddFavoritesButton anime={anime} />
                                </div>

                                {/* Producers */}
                                {anime.producers && anime.producers.length > 0 && (
                                    <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                        <Warehouse className="h-4 w-4" />
                                        <span>Producers:</span>
                                        {anime.producers.map((producer, index) => (
                                            <span key={producer.mal_id}>
                                                <a
                                                    href={producer.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline"
                                                >
                                                    {producer.name}
                                                </a>
                                                {index < anime.producers!.length - 1 && ', '}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Synopsis */}
                                <div className="mb-8">
                                    <h2 className="mb-3 text-xl font-bold text-foreground">
                                        Synopsis
                                    </h2>
                                    <p className="leading-relaxed text-muted-foreground">
                                        {anime.synopsis}
                                    </p>
                                </div>

                                {/* Related Anime */}
                                {anime.relations.length > 0 && (
                                    <div className="mb-8">
                                        <h3 className="mb-4 text-xl font-bold text-foreground">
                                            Related Anime
                                        </h3>
                                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                            {anime.relations.map((relation) => {
                                                if (relation.relation === relationsLabel.adaptation) {
                                                    return null
                                                }
                                                return (
                                                    <div
                                                        key={relation.relation}
                                                        className="rounded-xl bg-card border border-border/50 p-4"
                                                    >
                                                        <h4 className="mb-3 text-sm font-semibold text-primary">
                                                            {relation.relation}
                                                        </h4>
                                                        <div className="flex flex-col gap-2">
                                                            {relation.entry.map((entry) => (
                                                                <Link
                                                                    key={entry.mal_id}
                                                                    href={`/anime/${entry.mal_id}`}
                                                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                                                >
                                                                    {entry.name}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* Characters Section */}
                            <section className="mt-8 w-full">
                                <h2 className="mb-4 text-xl font-bold text-foreground">
                                    Characters
                                </h2>
                                {characters.length === 0 ? (
                                    <p className="text-center text-muted-foreground">
                                        No characters found for this anime.
                                    </p>
                                ) : (
                                    <CharactersList characters={characters} />
                                )}
                            </section>

                            {/* STREAMING PLATFORMS & EPISODES TABS */}

                            <section className="mt-8 md:min-w-max lg:min-w-3xl">
                                <Tabs
                                    defaultValue={tabsContents[0].tabsName}
                                    className="h-80 w-full md:h-96"
                                >
                                    <TabsList className="grid w-full grid-cols-2 gap-2 bg-gray-900">
                                        {tabsContents.map(({ tabsName }) => (
                                            <TabsTrigger
                                                key={tabsName}
                                                value={tabsName}
                                                className="h-full rounded-md text-white data-[state=active]:bg-purple-600 data-[state=inactive]:bg-black/60"
                                            >
                                                {tabsName}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>

                                    <TabsContent
                                        value={'Where to watch'}
                                        className={`my-4 h-64 overflow-y-auto`}
                                    >
                                        {streamingServices.length > 0 ? (
                                            <StreamingPlatforms
                                                platforms={streamingServices}
                                                animeTitle={anime.title}
                                            />
                                        ) : (
                                            <div className="py-8 text-center text-gray-300">
                                                there are no streaming platforms
                                                available for this anime.
                                            </div>
                                        )}
                                    </TabsContent>
                                    <TabsContent
                                        value="Episodes"
                                        className={`my-4 h-64 overflow-y-auto`}
                                    >
                                        <EpisodesList animeId={anime.mal_id} />
                                    </TabsContent>
                                </Tabs>
                            </section>
                        </div>
                    </div>

                    {/* RECOMMENDATIONS SECTION */}

                    {recommendations.length > 0 ? (
                        <section>
                            <h2 className="my-6 text-2xl font-bold">
                                Anime Recommendations based in this anime
                            </h2>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                                {recommendations
                                    .slice(0, 6)
                                    .map(
                                        (
                                            recommendedAnime: JikanRecommendations
                                        ) => (
                                            <Link
                                                key={
                                                    recommendedAnime.entry
                                                        .mal_id
                                                }
                                                href={`/anime/${recommendedAnime.entry.mal_id}`}
                                                className="group"
                                            >
                                                <div className="relative rounded-lg transition-transform group-hover:scale-105">
                                                    <img
                                                        src={
                                                            recommendedAnime
                                                                .entry.images
                                                                ?.jpg
                                                                ?.image_url ||
                                                            '/placeholder.svg'
                                                        }
                                                        alt={
                                                            recommendedAnime
                                                                .entry.title
                                                        }
                                                        className="aspect-2/3 w-full object-cover"
                                                    />
                                                    <div className="absolute right-0 bottom-0 left-0 bg-linear-to-t from-black/80 via-neutral-950/90 to-transparent p-2">
                                                        <h3 className="line-clamp-2 text-center text-lg font-medium text-balance">
                                                            {
                                                                recommendedAnime
                                                                    .entry.title
                                                            }
                                                        </h3>
                                                    </div>
                                                </div>
                                            </Link>
                                        )
                                    )}
                            </div>
                        </section>
                    ) : (
                        <section className="">
                            <h2 className="my-6 text-2xl font-bold">
                                Anime Recommendations based in this anime
                            </h2>
                            <p className="text-center">
                                there are no recommendations available for this
                                anime.
                            </p>
                        </section>
                    )}
                </main>
            </div>
        </FavoriteProvider>
    )
}
