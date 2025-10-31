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
import { formatDate } from '@/lib/utils/utils'
import { BackButton } from '@/components/BackButton/BackButton'
import { AddToListButton } from '@/components/ui/AddToListButton'
import { FavoriteProvider } from '@/context/favoriteContext'
import { convertJSTToLocal } from '@/lib/utils/utils'
import { CharactersList } from './components/CharactersList/CharactersList'

interface Params {
    id: number
}

export async function generateMetadata({
    params,
}: {
    params: Promise<Params>
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
    params: Promise<Params>
}) {
    const TabsContes = [
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

    const streamingServices = formatStreamingPlatforms(anime?.streaming)

    const characters = await getAnimeCharacters(id)
    if (!anime) {
        return notFound()
    }

    return (
        <FavoriteProvider>
            <div className="min-h-screen bg-gray-950 text-gray-100">
                <div className="relative h-[300px] md:hidden md:h-[620px]">
                    <img
                        src={
                            anime.images?.jpg?.large_image_url ||
                            anime.images?.jpg?.image_url ||
                            '/placeholder.svg'
                        }
                        alt={anime.title}
                        className="object-cover brightness-70 md:object-fill"
                        sizes="(max-width: 768px) 100vw, 250px"
                    />
                    <BackButton />
                </div>
                <main className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-[250px_1fr]">
                        <div className="relative mx-auto -mt-16 md:mx-0 md:mt-0">
                            <img
                                src={
                                    anime.images?.webp?.image_url ||
                                    '/placeholder.svg'
                                }
                                alt={anime.title}
                                className="aspect-2/3 rounded-lg object-cover shadow-xl"
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            {/* ANIME INFORMATION */}
                            <section>
                                <h1 className="mb-2 font-gothic text-3xl italic md:text-4xl">
                                    {anime.title}
                                </h1>
                                {anime.title_english && (
                                    <p className="mb-4 text-gray-300">
                                        {anime.title_english}
                                    </p>
                                )}

                                <div className="mb-4 flex flex-wrap gap-2">
                                    {anime.genres?.map((genre) => (
                                        <div
                                            key={genre.mal_id}
                                            className="border-gray-600"
                                        >
                                            {genre.name}
                                        </div>
                                    ))}
                                </div>

                                <div className="mb-6 flex flex-wrap items-center gap-6 text-lg">
                                    <div className="flex flex-col flex-wrap items-start justify-center-safe gap-2 md:flex-row md:items-center">
                                        <div className="flex flex-wrap items-center-safe gap-1">
                                            <Target className="mr-1 h-5 w-5" />
                                            Demography:{' '}
                                            {anime.demographics &&
                                                anime.demographics?.map(
                                                    (demographic) => (
                                                        <div
                                                            key={
                                                                demographic.mal_id
                                                            }
                                                            className="rounded-xl p-2 text-gray-100"
                                                        >
                                                            {demographic.name}
                                                        </div>
                                                    )
                                                )}
                                        </div>
                                        <div className="flex items-center gap-1 rounded-xl text-gray-100">
                                            <House className="mr-1 h-5 w-5" />
                                            Studios/Producers:
                                            {anime.studios?.map((studio) => (
                                                <div
                                                    key={studio.mal_id}
                                                    className="flex items-center gap-1 border-r-red-600"
                                                >
                                                    <a
                                                        key={studio.mal_id}
                                                        className="rounded-xl p-2 text-gray-100"
                                                        href={studio.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {studio.name}
                                                    </a>
                                                </div>
                                            ))}
                                            {anime.studios?.length === 0 && (
                                                <span className="rounded-xl p-2 text-gray-100">
                                                    Unknown
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Video /> Episodes: {anime.episodes}
                                        </div>

                                        {anime.status && (
                                            <div className="flex items-center gap-1 rounded-xl text-gray-100">
                                                <CalendarSearch className="mr-1 h-5 w-5" />
                                                Status:{anime.status}
                                            </div>
                                        )}
                                        {anime.score && (
                                            <div className="flex items-center">
                                                <Star className="mr-1 h-5 w-5 fill-yellow-500 text-yellow-500" />
                                                <span>{anime.score}/10</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center">
                                        <CalendarCheck className="mr-1 h-5 w-5 text-gray-300" />
                                        <span>
                                            premiered at: {anime.season}{' '}
                                            {anime.year}
                                        </span>
                                    </div>

                                    {anime.broadcast?.string && (
                                        <div className="flex flex-wrap items-center">
                                            <Clock className="mr-1 h-5 w-5 text-gray-300" />
                                            Broadcast:{' '}
                                            <span>
                                                {anime.broadcast.string} /{' '}
                                                {convertJSTToLocal(
                                                    anime.broadcast.string
                                                )}
                                            </span>
                                        </div>
                                    )}

                                    {anime.aired && (
                                        <div className="flex items-center">
                                            <CalendarDays className="mr-1 h-5 w-5 text-gray-300" />
                                            <span>
                                                Aired:{' '}
                                                {formatDate(anime.aired.from)}
                                                {' - '}
                                                {anime.aired.to ? (
                                                    formatDate(anime.aired.to)
                                                ) : (
                                                    <span>still airing</span>
                                                )}
                                            </span>
                                        </div>
                                    )}

                                    {episodeDuration && (
                                        <div className="flex items-center">
                                            <Hourglass className="mr-1 h-5 w-5 text-gray-300" />
                                            <span>
                                                Duration: {episodeDuration}
                                            </span>
                                        </div>
                                    )}
                                    {anime.rank && (
                                        <div className="flex items-center">
                                            <Trophy className="mr-1 h-5 w-5 text-gray-300" />
                                            <span>Rank: #{anime.rank}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="my-2 flex flex-row items-center gap-2">
                                    <AddToListButton anime={anime} />
                                    <button className="rounded bg-black/50 p-1 text-white hover:bg-black/70">
                                        <BookmarkPlus className="size-6" />
                                        <span className="sr-only">
                                            Add to a list
                                        </span>
                                    </button>
                                </div>
                                <div>
                                    <h2 className="mb-2 text-2xl font-bold">
                                        Synopsis
                                    </h2>
                                    <p className="mb-6 text-balance text-gray-200">
                                        {anime.synopsis}
                                    </p>
                                </div>

                                {/* Anime relations (e.g. Adaptation, Prequel, Sequel) */}

                                <h3 className="col-span-full mb-2 text-lg font-bold">
                                    Related Anime (Adaptation, Prequel, Sequel):
                                </h3>
                                <div className="flex flex-row flex-wrap gap-2 overflow-auto px-2 md:grid md:grid-cols-3">
                                    {anime.relations.length === 0 && (
                                        <p className="text-center text-gray-400">
                                            No related anime found.
                                        </p>
                                    )}
                                    {anime.relations.map((relation) => {
                                        if (
                                            relation.relation ===
                                            relationsLabel.adaptation
                                        ) {
                                            return null
                                        }
                                        return (
                                            <div
                                                key={relation.relation}
                                                className="mb-4 rounded-lg border-1 border-purple-950 p-1 text-balance"
                                            >
                                                <h4 className="my-2 border-b border-purple-800 pb-2 text-center text-lg font-bold">
                                                    {relation.relation}
                                                </h4>
                                                <div className="flex max-h-96 flex-col items-center-safe justify-center-safe gap-4 overflow-y-auto p-2 text-center text-gray-100">
                                                    {relation.entry.map(
                                                        (entry) => {
                                                            return (
                                                                <Link
                                                                    key={
                                                                        entry.mal_id
                                                                    }
                                                                    href={`/anime/${entry.mal_id}`}
                                                                    className="hover:underline"
                                                                >
                                                                    {entry.name}
                                                                </Link>
                                                            )
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </section>

                            {/* Characters SECTION */}
                            <section className="mt-8 md:min-w-max lg:min-w-3xl">
                                <h2 className="mb-4 text-2xl font-bold">
                                    Anime Characters:
                                </h2>
                                {characters.length === 0 && (
                                    <p className="text-center text-gray-400">
                                        No characters found for this anime.
                                    </p>
                                )}
                                <CharactersList characters={characters} />
                            </section>

                            {/* STREAMING PLATFORMS & EPISODES TABS */}

                            <section className="mt-8 md:min-w-max lg:min-w-3xl">
                                <Tabs
                                    defaultValue={TabsContes[0].tabsName}
                                    className="h-80 w-full md:h-96"
                                >
                                    <TabsList className="grid w-full grid-cols-2 gap-2 bg-gray-900">
                                        {TabsContes.map(({ tabsName }) => (
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
