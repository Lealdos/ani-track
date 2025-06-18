import { Anime } from '@/types/anime'
import { Suspense } from 'react'
import { AnimeListSkeleton } from '../SkeletonCard/AnimeSkeletonList'
// import { SkeletonCard } from '../SkeletonCard/skeletonCard'
import { mergeClassNames } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
interface TopAnimeProps {
    topAnime: Promise<Anime[]>
}

export async function TopAnime({ topAnime }: TopAnimeProps) {
    const animes = await topAnime
    return (
        <section className="m-4">
            <Suspense fallback={<AnimeListSkeleton sectionName="top-anime" />}>
                <main className="flex items-center gap-2 overflow-hidden overflow-x-auto px-2 py-4">
                    {animes?.map((anime) => (
                        <Link
                            href={`/anime/${anime.mal_id}`}
                            key={anime.mal_id}
                            className="relative flex flex-row items-center transition-transform hover:scale-105"
                            aria-label={`top ${anime.rank} - ${anime.title}`}
                        >
                            {/*  ranking number behind the  card */}
                            <span
                                className={mergeClassNames(
                                    `gradient-top-number pointer-events-none relative text-center font-gothic text-[200px] leading-none text-gray-900 antialiased select-none md:text-[220px]`,
                                    anime?.rank !== undefined && anime.rank > 9
                                        ? 'tracking-[-1.5rem] md:tracking-[-2rem]'
                                        : ''
                                )}
                            >
                                {anime.rank}
                            </span>

                            {/*  anime card */}

                            <Image
                                className={mergeClassNames(
                                    `relative h-70 max-w-[200px] min-w-[200px] rounded`,
                                    (anime?.rank ?? 0) > 9
                                        ? '-left-6 md:-left-12'
                                        : '-left-8 md:-left-10'
                                )}
                                src={
                                    anime.images?.webp?.image_url ||
                                    '/placeholder.jpg'
                                }
                                alt={anime.title}
                            />
                        </Link>
                    ))}
                </main>
            </Suspense>
        </section>
    )
}
