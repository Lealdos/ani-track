/* eslint-disable @next/next/no-img-element */
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import {
    Star,
    Clock,
    Video,
    House,
    CalendarSearch,
    Hourglass,
    CalendarCheck,
    CalendarDays,
    Trophy,
    Warehouse,
} from 'lucide-react'
import { StreamingPlatforms } from '@/app/[locale]/anime/[id]/_components/streamingPlatforms/StreamingPlatforms'
import { EpisodesList } from '@/app/[locale]/anime/[id]/_components/EpisodeList/EpisodeList'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'

import { toStreamingPlatform } from '@/entities/anime/api'
import { fetchAnimeDetailByMalId } from '@/entities/anime/api/ani-list/anilistDetail'

import { jikanAnimeRepo } from '@/entities/anime/api/Jikan/JikanAnimeRepository'

import type {
    Recommendation,
    AnimeGenre,
    AnimeEntry,
    AnimeStudio,
    AnimeProducer,
    AnimeRelation,
} from '@/entities/anime/models'
import { imgOf } from '@/entities/anime/models'
import { formatDate, convertJSTToLocal } from '@/lib/utils'
import { BackButton } from '@/components/shared/BackButton/BackButton'
import { AddFavoritesButton } from '@/components/shared/AddToFavorites/AddToFavoritesListButton'
import { CharactersList } from './_components/CharactersList/CharactersList'
import { FreePage } from './_components/FreePage/FreePage'
import { WatchStatusButton } from '@/components/shared/WatchStatusActions/WatchStatusActions'
import { AddToListButton } from '@/components/shared/AddToListButton/AddToListButton'
import { ShareButton } from '@/components/shared/ShareButton/ShareButton'

interface PageParams {
    id: number
}

export async function generateMetadata({
    params,
}: {
    params: Promise<PageParams>
}) {
    const { id } = await params
    const result = await fetchAnimeDetailByMalId(id)

    if (!result) {
        const t = await getTranslations('AnimeDetail')
        return {
            title: t('notFound'),
        }
    }

    const { anime } = result

    const title = `AniTrack | ${anime.title}`
    const description =
        anime.synopsis ??
        `Discover ${anime.title} on AniTrack — episodes, streaming platforms, characters, and recommendations.`
    const image = anime.bannerImage || imgOf(anime)

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `/anime/${id}`,
            siteName: 'AniTrack',
            type: 'video.tv_show',
            images: image
                ? [
                      {
                          url: image,
                          alt: `${anime.title} cover`,
                      },
                  ]
                : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: image ? [image] : undefined,
        },
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
    params: Promise<PageParams & { locale: string }>
}) {
    const { id, locale } = await params
    setRequestLocale(locale)
    const t = await getTranslations('AnimeDetail')

    const tabsContents = [
        { tabsName: t('tabStreaming') },
        { tabsName: t('tabEpisodes') },
    ]

    const result = await fetchAnimeDetailByMalId(id)
    const animeDetail = await jikanAnimeRepo.findById(id)

    console.log('Result from Jikan API:', animeDetail)
    if (!result) return notFound()

    const { duration: episodeDuration, ...anime } = result.anime

    const recommendations = result.recommendations
    const characters = result.characters

    const streamingServices = (anime?.streaming ?? []).map(toStreamingPlatform)

    return (
        <>
            {/* background image in mobile view */}
            <article className="w-full rounded-lg text-gray-100 shadow-lg">
                <div className="relative h-[55vh] w-full overflow-hidden">
                    <img
                        src={anime.bannerImage || imgOf(anime)}
                        alt={`${anime.title} backdrop`}
                        className="h-full w-full scale-110 object-cover opacity-60"
                    />
                    <div className="bg-linear-to-b from-background/30 via-background/70 to-background absolute inset-0" />
                    <BackButton />
                </div>
                <main className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-[250px_1fr]">
                        <div className="relative mx-auto -mt-16 md:mx-0 md:mt-0">
                            <img
                                src={imgOf(anime)}
                                alt={anime.title}
                                className="aspect-2/3 rounded-lg object-cover shadow-xl"
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            {/* ANIME INFORMATION */}
                            <section>
                                <h1 className="font-gothic mb-2 text-3xl italic md:text-4xl">
                                    {anime.titleRomaji}
                                </h1>
                                {anime.titleEnglish && (
                                    <p className="mb-4 text-gray-300">
                                        {anime.titleEnglish}
                                    </p>
                                )}

                                <div className="mb-4 flex flex-wrap gap-2">
                                    {anime.genres?.map((genre: AnimeGenre) => (
                                        <div
                                            key={genre.id}
                                            className="border-gray-600"
                                        >
                                            {genre.name}
                                        </div>
                                    ))}
                                </div>

                                <div className="mb-6 flex flex-wrap items-center gap-6 text-lg">
                                    <div className="flex flex-col flex-wrap items-start gap-2 md:flex-row md:items-center">
                                        {/* <div className="flex flex-wrap items-center-safe gap-1">
                                            <Target className="mr-1 h-5 w-5" />
                                            Demography:{' '}
                                            {anime.demographics?.map(
                                                (demographic: AnimeEntry) => (
                                                    <div
                                                        key={demographic.id}
                                                        className="rounded-xl p-2 text-gray-100"
                                                    >
                                                        {demographic.name}
                                                    </div>
                                                )
                                            )}
                                        </div> */}
                                        <div className="flex items-center gap-1 rounded-xl text-gray-100">
                                            <House className="mr-1 h-5 w-5" />
                                            {t('studio')}
                                            <div className="flex flex-wrap items-center gap-1 rounded-xl text-gray-100">
                                                {anime.studios?.map(
                                                    (studio: AnimeStudio) => (
                                                        <div
                                                            key={studio.id}
                                                            className="flex flex-wrap items-center gap-1"
                                                        >
                                                            <a
                                                                key={studio.id}
                                                                className="rounded-xl p-2 text-gray-100"
                                                                href={
                                                                    studio.url
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                {studio.name}
                                                            </a>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                            {anime.studios?.length === 0 && (
                                                <span className="rounded-xl p-2 text-gray-100">
                                                    {t('unknown')}
                                                </span>
                                            )}
                                        </div>

                                        {anime.episodes && (
                                            <div className="flex items-center gap-1">
                                                <Video /> {t('episodes')}{' '}
                                                {anime.episodes ||
                                                    t('stillAiring')}
                                            </div>
                                        )}

                                        {anime.status && (
                                            <div className="flex items-center gap-1 rounded-xl text-gray-100">
                                                <CalendarSearch className="mr-1 h-5 w-5" />
                                                {t('status')} {anime.status}
                                            </div>
                                        )}
                                        {!!anime?.score && (
                                            <div className="flex items-center">
                                                <Star className="mr-1 h-5 w-5 fill-yellow-500 text-yellow-500" />
                                                <span>{anime.score}/10</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center">
                                        <CalendarCheck className="mr-1 h-5 w-5 text-gray-300" />
                                        <span>
                                            {t('premieredAt')} {anime.season}{' '}
                                            {anime.year}
                                        </span>
                                    </div>

                                    {anime.broadcast?.string && (
                                        <div className="flex flex-wrap items-center">
                                            <Clock className="mr-1 h-5 w-5 text-gray-300" />
                                            {t('broadcast')}{' '}
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
                                                {t('aired')}{' '}
                                                {formatDate(anime.aired.from)}
                                                {' - '}
                                                {anime.aired.to ? (
                                                    formatDate(anime.aired.to)
                                                ) : (
                                                    <span>
                                                        {t('stillAiringInline')}
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    )}

                                    {episodeDuration && (
                                        <div className="flex items-center">
                                            <Hourglass className="mr-1 h-5 w-5 text-gray-300" />
                                            <span>
                                                {t('duration')}{' '}
                                                {episodeDuration}
                                            </span>
                                        </div>
                                    )}
                                    {!!anime.rank && (
                                        <div className="flex items-center">
                                            <Trophy className="mr-1 h-5 w-5 text-gray-300" />
                                            <span>
                                                {t('rank')} #{anime.rank}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="my-2 flex flex-row flex-wrap items-center gap-4">
                                    <WatchStatusButton anime={anime} />
                                    <AddToListButton anime={anime} showLabel />
                                    <AddFavoritesButton anime={anime} />
                                    <ShareButton
                                        title={`${anime.title} | AniTrack`}
                                        text={anime.synopsis ?? undefined}
                                    />
                                </div>

                                {/* producers section */}
                                <div className="flex flex-wrap items-center gap-1 rounded-xl text-gray-100">
                                    <div className="flex">
                                        <Warehouse className="mr-1 h-5 w-5" />
                                        {t('producers')}
                                    </div>
                                    <div className="flex flex-wrap">
                                        {anime.producers?.map(
                                            (producer: AnimeProducer) => (
                                                <a
                                                    key={producer.id}
                                                    className="p-2 text-gray-100"
                                                    href={producer.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {producer.name}
                                                </a>
                                            )
                                        )}
                                        {anime.producers?.length === 0 && (
                                            <span className="p-2 text-gray-100">
                                                {t('unknown')}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h2 className="mb-2 text-2xl font-bold">
                                        {t('synopsis')}
                                    </h2>
                                    <p className="mb-6 text-balance text-gray-200">
                                        {anime.synopsis}
                                    </p>
                                </div>
                                {/* trailer section */}
                                {anime.trailer?.embedUrl && (
                                    <div className="shadow-soft border-border/60 my-6 overflow-hidden rounded-xl border">
                                        <div className="aspect-video w-full">
                                            <iframe
                                                src={
                                                    anime.trailer.embedUrl +
                                                    '?autoplay=0'
                                                }
                                                title={`${anime.title} trailer`}
                                                allow="accelerometer; clipboard-write; encrypted-media; gyroscope ;  picture-in-picture ;"
                                                allowFullScreen
                                                loading="lazy"
                                                className="h-full w-full"
                                            />
                                        </div>
                                    </div>
                                )}
                                {/* Anime relations (e.g. Adaptation, Prequel, Sequel) */}

                                <h3 className="col-span-full my-2 text-lg font-bold">
                                    {t('relatedAnime')}
                                </h3>
                                <div className="flex flex-row flex-wrap gap-2 overflow-auto px-2 md:grid md:grid-cols-3">
                                    {anime.relations.length === 0 && (
                                        <p className="text-center text-gray-400">
                                            {t('noRelated')}
                                        </p>
                                    )}
                                    {anime.relations.map(
                                        (relation: AnimeRelation) => {
                                            if (
                                                relation.relation ===
                                                relationsLabel.adaptation
                                            ) {
                                                return null
                                            }
                                            return (
                                                <div
                                                    key={relation.relation}
                                                    className="mb-4 w-full text-balance rounded-lg border border-purple-950 p-1"
                                                >
                                                    <h4 className="my-2 border-b border-purple-800 pb-2 text-center text-lg font-bold">
                                                        {relation.relation}
                                                    </h4>
                                                    <div className="items-center-safe justify-center-safe flex max-h-96 flex-col gap-4 overflow-y-auto p-2 text-center text-gray-100">
                                                        {relation.entry.map(
                                                            (
                                                                entry: AnimeEntry
                                                            ) => {
                                                                return (
                                                                    <Link
                                                                        key={
                                                                            entry.id
                                                                        }
                                                                        href={`/anime/${entry.id}`}
                                                                        className="hover:underline"
                                                                    >
                                                                        {
                                                                            entry.name
                                                                        }
                                                                    </Link>
                                                                )
                                                            }
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        }
                                    )}
                                </div>
                            </section>

                            {/* STREAMING PLATFORMS & EPISODES TABS */}

                            <section className="lg:min-w-3xl mt-8 md:min-w-max">
                                <Tabs
                                    defaultValue={tabsContents[0].tabsName}
                                    className="h-80 w-full md:h-96"
                                >
                                    <TabsList className="grid h-fit w-full grid-cols-2 items-center justify-center gap-4 self-center rounded-md bg-amber-950/60 align-middle text-sm text-gray-300">
                                        {tabsContents.map(({ tabsName }) => (
                                            <TabsTrigger
                                                key={tabsName}
                                                value={tabsName}
                                                className="rounded-md text-base text-white data-[state=active]:bg-rose-950 data-[state=inactive]:bg-black/70"
                                            >
                                                {tabsName}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>

                                    <TabsContent
                                        value={tabsContents[0].tabsName}
                                        className={`my-4 h-64 overflow-y-auto`}
                                    >
                                        {streamingServices.length > 0 ? (
                                            <StreamingPlatforms
                                                platforms={streamingServices}
                                                animeTitle={anime.title}
                                            />
                                        ) : (
                                            <div className="py-8 text-center text-gray-300">
                                                {t('noStreaming')}
                                            </div>
                                        )}
                                    </TabsContent>
                                    <TabsContent
                                        value={tabsContents[1].tabsName}
                                        className={`my-4 h-64 overflow-y-auto`}
                                    >
                                        <EpisodesList animeId={anime.id} />
                                    </TabsContent>
                                </Tabs>
                            </section>

                            <FreePage
                                animeTitleRomaji={
                                    anime.titleRomaji ?? anime.title
                                }
                            />

                            {/* Characters SECTION */}
                            <section className="lg:min-w-3xl mt-8 md:min-w-max">
                                <h2 className="mb-4 text-2xl font-bold">
                                    {t('characters')}
                                </h2>
                                {characters.length === 0 && (
                                    <p className="text-center text-gray-400">
                                        {t('noCharacters')}
                                    </p>
                                )}
                                <CharactersList characters={characters} />
                            </section>
                        </div>
                    </div>

                    {/* RECOMMENDATIONS SECTION */}

                    {recommendations.length > 0 ? (
                        <section>
                            <h2 className="my-6 text-2xl font-bold">
                                {t('recommendations')}
                            </h2>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                                {recommendations
                                    .slice(0, 6)
                                    .map((recommendedAnime: Recommendation) => (
                                        <Link
                                            key={recommendedAnime.entry.id}
                                            href={`/anime/${recommendedAnime.entry.id}`}
                                            className="group"
                                        >
                                            <div className="relative rounded-lg transition-transform group-hover:scale-105">
                                                <img
                                                    src={
                                                        recommendedAnime.entry
                                                            .images?.jpg
                                                            ?.imageUrl ||
                                                        '/placeholder.svg'
                                                    }
                                                    alt={
                                                        recommendedAnime.entry
                                                            .title
                                                    }
                                                    className="aspect-2/3 w-full object-cover"
                                                />
                                                <div className="bg-linear-to-t absolute bottom-0 left-0 right-0 from-black/80 via-neutral-950/90 to-transparent p-2">
                                                    <h3 className="line-clamp-2 text-balance text-center text-lg font-medium">
                                                        {
                                                            recommendedAnime
                                                                .entry.title
                                                        }
                                                    </h3>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                            </div>
                        </section>
                    ) : (
                        <section className="">
                            <h2 className="my-6 text-2xl font-bold">
                                {t('recommendations')}
                            </h2>
                            <p className="text-center">
                                {t('noRecommendations')}
                            </p>
                        </section>
                    )}
                </main>
            </article>
        </>
    )
}
