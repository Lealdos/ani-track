import { AnimeCard } from '@/components/anime-card';
import type { Anime } from '@/types/anime';

interface AnimeListProps {
    animes: Anime[];
    showBadge?: boolean;
}

export function AnimeList({ animes, showBadge = false }: AnimeListProps) {
    if (!animes) return null;
    return (
        <div className='relative'>
            <div
                id='anime-scroll-container'
                className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide md:flex-wrap justify-between '
                style={{ scrollBehavior: 'smooth' }}
            >
                {animes.map((anime) => (
                    <div
                        key={`${anime.title}-${anime.mal_id}`}
                        className='w-[160px] flex-shrink-0 sm:w-[180px]'
                    >
                        <AnimeCard anime={anime} showBadge={showBadge} />
                    </div>
                ))}
            </div>
        </div>
    );
}
