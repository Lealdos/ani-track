import { Anime } from '@/types/anime'
import { Suspense } from 'react'
import { AnimeListSkeleton } from '../SkeletonCard/AnimeSkeletonList'
import { AnimeCard } from '../AnimeCard/AnimeCard'
// import { SkeletonCard } from '../SkeletonCard/skeletonCard'
import { mergeClassNames } from '@/lib/utils'
interface TopAnimeProps {
    topAnime: Promise<Anime[]>
}

export async function TopAnime({ topAnime }: TopAnimeProps) {
    const animes = await topAnime
    return (
        <section className="m-4">
            <Suspense fallback={<AnimeListSkeleton sectionName="top-anime" />}>
                <main className="flex items-center gap-6 overflow-hidden overflow-x-auto px-2 py-4">
                    {animes?.map((anime) => (
                        <div
                            key={anime.mal_id}
                            className="relative flex h-[380px] max-h-[380px] w-[380px] flex-shrink-0 flex-row items-center"
                        >
                            {/*  ranking number behind the  card */}
                            <text
                                fill="#232d2d"
                                className={mergeClassNames(
                                    `testing pointer-events-none relative text-center font-gothic text-[200px] leading-none text-gray-900/70 antialiased select-none md:text-[220px]`,
                                    (anime?.rank ?? 0) > 9
                                        ? 'tracking-[-1.5rem] md:tracking-[-2rem]'
                                        : ''
                                )}
                            >
                                {anime.rank}
                            </text>

                            {/*  anime card */}
                            <div
                                className={mergeClassNames(
                                    `relative z-10 min-w-[240px]`,
                                    (anime?.rank ?? 0) > 9
                                        ? '-left-6 md:-left-14'
                                        : '-left-6 md:-left-8'
                                )}
                            >
                                <AnimeCard anime={anime} hasFooter={false} />
                            </div>
                        </div>
                    ))}
                </main>
            </Suspense>
        </section>
    )
}
