import { notFound } from 'next/navigation'

interface Genre {
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
        title: `${anime.title} | AniTrack`,
        description: anime.synopsis,
    }
}

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Star, Calendar, Clock } from 'lucide-react'
import { StreamingPlatforms } from '@/components/streaming-platforms'
import { EpisodeList } from '@/components/episode-list'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Comments } from '@/components/comments'
import {
    getAnimeById,
    getAnimeEpisodes,
    getAnimeRecommendations,
    formatStreamingPlatforms,
} from '@/lib/api'

export default async function AnimePage({
    params,
}: {
    params: Promise<Params>
}) {
    const { id } = await params

    // Fetch anime details from API
    const anime = await getAnimeById(id)

    // Fetch episodes
    const episodesData = await getAnimeEpisodes(id)
    const episodes = episodesData.data || []

    // Fetch recommendations
    const recommendations = await getAnimeRecommendations(id)

    // Format streaming platforms
    const platforms = formatStreamingPlatforms(anime?.streaming)

    if (!anime) {
        return notFound()
    }

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100">
            <div className="relative h-[300px] md:h-[400px]">
                <Image
                    src={
                        anime.images?.jpg?.large_image_url || '/placeholder.svg'
                    }
                    alt={anime.title}
                    fill
                    className="xwn object-cover brightness-60"
                    priority
                />
                <div className="absolute top-4 left-4">
                    <Link href="/">
                        <button className="rounded-full border-gray-700 bg-black/50">
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-[250px_1fr]">
                    <div className="relative z-10 mx-auto -mt-32 md:mx-0 md:-mt-40">
                        <Image
                            src={
                                anime.images?.jpg?.image_url ||
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
                                {anime.title_japanese}
                            </p>
                        )}

                        <div className="mb-4 flex flex-wrap gap-2">
                            {anime.genres?.map((genre: any) => (
                                <div
                                    key={genre.mal_id}
                                    className="border-gray-600"
                                >
                                    {genre.name}
                                </div>
                            ))}
                        </div>

                        <div className="mb-6 flex flex-wrap items-center gap-6 text-sm">
                            {anime.score && (
                                <div className="flex items-center">
                                    <Star className="mr-1 h-5 w-5 fill-yellow-500 text-yellow-500" />
                                    <span>{anime.score}/10</span>
                                </div>
                            )}
                            {anime.year && (
                                <div className="flex items-center">
                                    <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                                    <span>{anime.year}</span>
                                </div>
                            )}
                            {anime.duration && (
                                <div className="flex items-center">
                                    <Clock className="mr-1 h-4 w-4 text-gray-400" />
                                    <span>{anime.duration}</span>
                                </div>
                            )}
                            {anime.status && (
                                <div className="bg-purple-900/50 text-purple-200 hover:bg-purple-900/70">
                                    {anime.status}
                                </div>
                            )}
                        </div>

                        <p className="mb-6 text-gray-300">{anime.synopsis}</p>

                        <Tabs defaultValue="episodes" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 bg-gray-900">
                                <TabsTrigger value="episodes">
                                    Episodios
                                </TabsTrigger>
                                <TabsTrigger value="watch">
                                    Dónde Ver
                                </TabsTrigger>
                                <TabsTrigger value="comments">
                                    Comentarios
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="episodes" className="mt-4">
                                <EpisodeList
                                    episodes={episodes}
                                    animeId={id.toString()}
                                />
                            </TabsContent>
                            <TabsContent value="watch" className="mt-4">
                                {platforms.length > 0 ? (
                                    <StreamingPlatforms platforms={platforms} />
                                ) : (
                                    <div className="py-8 text-center text-gray-400">
                                        No hay información disponible sobre
                                        plataformas de streaming para este
                                        anime.
                                    </div>
                                )}
                            </TabsContent>
                            <TabsContent value="comments" className="mt-4">
                                <Comments />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                <br className="my-8 bg-gray-800" />

                <section>
                    <h2 className="mb-6 text-2xl font-bold">Recomendaciones</h2>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                        {recommendations.slice(0, 6).map((item: any) => (
                            <Link
                                key={item.entry.mal_id}
                                href={`/anime/${item.entry.mal_id}`}
                                className="group"
                            >
                                <div className="relative overflow-hidden rounded-lg transition-transform group-hover:scale-105">
                                    <Image
                                        src={
                                            item.entry.images?.jpg?.image_url ||
                                            '/placeholder.svg'
                                        }
                                        alt={item.entry.title}
                                        width={200}
                                        height={300}
                                        className="aspect-[2/3] w-full object-cover"
                                    />
                                    <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                        <h3 className="line-clamp-2 text-sm font-medium">
                                            {item.entry.title}
                                        </h3>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}
