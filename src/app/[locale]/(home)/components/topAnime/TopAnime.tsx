/* eslint-disable @next/next/no-img-element */
import { Anime } from '@/entities/anime/models'
import { cn } from '@/lib/utils'
import { Link } from '@/i18n/navigation'
// import Image from 'next/image'
interface TopAnimeProps {
    topAnime: Promise<Anime[]>
}

export async function TopAnime({ topAnime }: TopAnimeProps) {
    const animes = await topAnime
    return (
        <section className="m-4">
            <ul className="flex items-center gap-2 overflow-hidden overflow-x-auto px-2 py-4">
                {animes?.map((anime) => (
                    <li key={`${anime.id}-top-animes`}>
                        <Link
                            href={`/anime/${anime.id}`}
                            className="relative flex flex-row items-center transition-transform hover:scale-105"
                            aria-label={`top ${anime.rank} - ${anime.title}`}
                        >
                            {/*  ranking number behind the  card */}
                            <span
                                className={cn(
                                    `gradient-top-number font-gothic pointer-events-none relative select-none text-center text-[200px] leading-none text-gray-900 antialiased md:text-[220px]`,
                                    anime?.rank !== undefined && anime.rank > 9
                                        ? 'tracking-[-1.5rem] md:tracking-[-2rem]'
                                        : ''
                                )}
                            >
                                {anime.rank}
                            </span>

                            {/*  anime card */}
                            <img
                                className={cn(
                                    `h-70 relative min-w-[200px] max-w-[200px] rounded`,
                                    (anime?.rank ?? 0) > 9
                                        ? '-left-6 md:-left-12'
                                        : '-left-8 md:-left-10'
                                )}
                                width={800}
                                height={580}
                                src={
                                    anime.images?.webp?.imageUrl ||
                                    '/placeholder.svg'
                                }
                                alt={anime.title}
                            />
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    )
}
