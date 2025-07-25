/* eslint-disable @next/next/no-img-element */
import { notFound } from 'next/navigation'
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

    const {episodes} = await getAnimeEpisodes(id)

    const recommendations = await getAnimeRecommendations(id)

    const streamingServices = formatStreamingPlatforms(anime?.streaming)

    if (!anime) {
        return notFound()
    }

    return (
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
                    <div className="relative mx-auto -mt-32 md:mx-0 md:mt-10">
                        <img
                            src={
                                anime.images?.webp?.image_url ||
                                '/placeholder.svg'
                            }
                            alt={anime.title}
                            className="aspect-[2/3] rounded-lg object-cover shadow-xl"
                            
                        />
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <section>
                            <h1 className="mb-2 text-3xl font-bold md:text-4xl">
                                {anime.title}
                            </h1>
                            {anime.title_english && (
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

                                {anime.broadcast?.string && (
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
                        </section>

                        <section className="mt-8 min-w-full md:min-w-max">
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
                                    className={`my-4 h-64 overflow-y-auto  `}
                                >
                                    {streamingServices.length > 0 ? (
                                        <StreamingPlatforms
                                            platforms={streamingServices}
                                            animeTitle={anime.title}
                                        />
                                    ) : (
                                        <div className="py-8 text-center text-gray-400">
                                            there are no streaming platforms
                                            available for this anime.
                                        </div>
                                    )}
                                </TabsContent>
                                <TabsContent
                                    value="Episodes"
                                    className={`my-4 h-64 overflow-y-auto  `}
                                >
                                    <EpisodeList
                                        episodes={episodes}
                                        animeId={id.toString()}
                                    />
                                </TabsContent>
                            </Tabs>
                        </section>
                    </div>
                </div>

                {recommendations.length > 0 && (
                    <section>
                        <h2 className="my-6 text-2xl font-bold">
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
                                        <div className="relative rounded-lg transition-transform group-hover:scale-105">
                                            <img
                                                src={
                                                    recommendedAnime.entry
                                                        .images?.jpg
                                                        ?.image_url ||
                                                    '/placeholder.svg'
                                                }
                                                
                                                alt={
                                                    recommendedAnime.entry.title
                                                }
                                                className="aspect-[2/3] w-full object-cover"
                                            />
                                            <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 via-neutral-950/90 to-transparent p-2">
                                                <h3 className="line-clamp-2 text-lg font-medium text-balance text-center">
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
            </main>
        </div>
    )
}
