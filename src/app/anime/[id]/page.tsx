import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Calendar, Clock } from 'lucide-react'
import { StreamingPlatforms } from '@/components/streamingPlatforms/StreamingPlatforms'
import { EpisodeList } from '@/components/EpisodeList/EpisodeList'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'

// import { Comments } from '@/components/comments'
import {
    getAnimeById,
    getAnimeEpisodes,
    getAnimeRecommendations,
    formatStreamingPlatforms,
} from '@/lib/api'
import { Anime } from '@/types/anime'
import { formatDate } from '@/lib/utils'
import { BackButton } from '@/components/BackButton/BackButton'

interface Recommendations {
    entry: Anime
}
interface Genres {
    mal_id: number
    name: string
}
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

export default async function AnimePage({
    params,
}: {
    params: Promise<Params>
}) {
    const { id } = await params

    // Fetch anime details from API
    const animeData = await getAnimeById(id)
    if (!animeData) return null

    const { duration: episodeDuration, ...anime } = animeData

    const episodesData = await getAnimeEpisodes(id)
    const episodes = episodesData.data || []

    const recommendations = await getAnimeRecommendations(id)

    const streamingServices = formatStreamingPlatforms(anime?.streaming)

    if (!anime) {
        return notFound()
    }

    return (
        <main className="min-h-screen bg-gray-950 text-gray-100">
            <div className="relative h-[300px] md:h-[620px]">
                <Image
                    src={
                        anime.images?.jpg?.large_image_url ||
                        anime.images?.jpg?.image_url ||
                        '/placeholder.svg'
                    }
                    alt={anime.title}
                    className="object-cover brightness-70 md:object-fill"
                    priority
                    fill
                />
                <BackButton />
            </div>
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-[250px_1fr]">
                    <div className="relative z-10 mx-auto -mt-32 md:mx-0 md:-mt-40">
                        <Image
                            src={
                                anime.images?.webp?.image_url ||
                                '/placeholder.svg'
                            }
                            alt={anime.title}
                            width={250}
                            height={375}
                            className="aspect-[2/3] rounded-lg object-cover shadow-xl"
                            priority
                        />
                    </div>

                    <div>
                        <h1 className="mb-2 text-3xl font-bold md:text-4xl">
                            {anime.title}
                        </h1>
                        {anime.title_japanese && (
                            <p className="mb-4 text-gray-400">
                                {anime.title_english}
                            </p>
                        )}

                        <div className="mb-4 flex flex-wrap gap-2">
                            {anime.genres?.map((genre: Genres) => (
                                <div
                                    key={genre.mal_id}
                                    className="border-gray-600"
                                >
                                    {genre.name}
                                </div>
                            ))}
                        </div>

                        <div className="mb-6 flex flex-wrap items-center gap-6 text-sm">
                            {anime.status && (
                                <div className="rounded-xl bg-purple-900/50 p-1 text-purple-200 hover:bg-purple-900/70">
                                    {anime.status}
                                </div>
                            )}

                            {anime.score && (
                                <div className="flex items-center">
                                    <Star className="mr-1 h-5 w-5 fill-yellow-500 text-yellow-500" />
                                    <span>{anime.score}/10</span>
                                </div>
                            )}

                            <div className="flex items-center">
                                <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                                <span>
                                    premiered: {anime.season} {anime.year}
                                </span>
                            </div>

                            {anime.broadcast && (
                                <div className="flex items-center">
                                    <Clock className="mr-1 h-4 w-4 text-gray-400" />
                                    <span>
                                        Broadcast: {anime.broadcast.string}
                                    </span>
                                </div>
                            )}

                            {anime.aired && (
                                <div className="flex items-center">
                                    <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                                    <span>
                                        Aired: {formatDate(anime.aired.from)}
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
                                    <Clock className="mr-1 h-4 w-4 text-gray-400" />
                                    <span>{episodeDuration}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <h2 className="mb-2 text-2xl font-bold">
                                Synopsis
                            </h2>
                            <p className="mb-6 text-gray-300">
                                {anime.synopsis}
                            </p>
                        </div>

                        <Tabs defaultValue="watch" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 bg-gray-900">
                                <TabsTrigger
                                    value="watch"
                                    className="focus:bg-purple-900/70"
                                >
                                    where to watch
                                </TabsTrigger>
                                <TabsTrigger
                                    value="episodes"
                                    className="focus:bg-purple-900/70"
                                >
                                    episodes
                                </TabsTrigger>

                                {/* <TabsTrigger value="comments">
                                    comments
                                </TabsTrigger> */}
                            </TabsList>
                            <TabsContent value="episodes" className="mt-4">
                                <EpisodeList
                                    episodes={episodes}
                                    animeId={id.toString()}
                                />
                            </TabsContent>
                            <TabsContent value="watch" className="mt-4">
                                {streamingServices.length > 0 ? (
                                    <StreamingPlatforms
                                        platforms={streamingServices}
                                    />
                                ) : (
                                    <div className="py-8 text-center text-gray-400">
                                        there are no streaming platforms
                                        available for this anime.
                                    </div>
                                )}
                            </TabsContent>
                            {/* <TabsContent value="comments" className="mt-4">
                                <Comments />
                            </TabsContent> */}
                        </Tabs>
                    </div>
                </div>

                <br className="my-8 bg-gray-800" />

                {recommendations.length > 0 && (
                    <section>
                        <h2 className="mb-6 text-2xl font-bold">
                            Anime Recommendations based in this anime
                        </h2>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                            {recommendations
                                .slice(0, 6)
                                .map((recommendedAnime: Recommendations) => (
                                    <Link
                                        key={recommendedAnime.entry.mal_id}
                                        href={`/anime/${recommendedAnime.entry.mal_id}`}
                                        className="group"
                                    >
                                        <div className="relative overflow-hidden rounded-lg transition-transform group-hover:scale-105">
                                            <Image
                                                src={
                                                    recommendedAnime.entry
                                                        .images?.jpg
                                                        ?.image_url ||
                                                    '/placeholder.svg'
                                                }
                                                priority
                                                alt={
                                                    recommendedAnime.entry.title
                                                }
                                                width={200}
                                                height={300}
                                                className="aspect-[2/3] w-full object-cover"
                                            />
                                            <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                                <h3 className="line-clamp-2 text-sm font-medium">
                                                    {
                                                        recommendedAnime.entry
                                                            .title
                                                    }
                                                </h3>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                        </div>
                    </section>
                )}
            </div>
        </main>
    )
}
