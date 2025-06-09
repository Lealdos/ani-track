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
                <main className="flex gap-4 overflow-x-auto px-2 pb-4">
                    {animes?.map((anime) => (
                        <div
                            key={anime.mal_id}
                            className="relative flex h-[380px] max-h-[380px] w-[380px] flex-shrink-0 flex-row tracking-tight"
                        >
                            {/*  ranking number behind the  card */}
                            <span
                                className={mergeClassNames(
                                    `pointer-events-none relative top-16 text-center text-[220px] leading-none font-semibold text-gray-100/80 select-none md:top-4 md:text-[300px]`,
                                    (anime?.rank ?? 0) > 9
                                        ? 'tracking-[-2rem] md:tracking-[-2.4rem]'
                                        : ''
                                )}
                            >
                                {anime.rank}
                            </span>

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
