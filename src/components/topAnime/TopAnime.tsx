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
                            <span
                                className={mergeClassNames(
                                    `gradient-top-number pointer-events-none relative text-center font-gothic text-[200px] leading-none text-gray-900 antialiased select-none md:text-[220px]`,
                                    (anime?.rank ?? 0) > 9
                                        ? 'tracking-[-1.5rem] md:tracking-[-2rem]'
                                        : ''
                                )}
                            >
                                {anime.rank}
                            </span>

                            {/*  anime card */}
                            {/* cambiar este div por un link arriba y un imagen abajo
                             */}
                            <div
                                className={mergeClassNames(
                                    `relative h-70 max-w-[200px] min-w-[200px]`,
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
