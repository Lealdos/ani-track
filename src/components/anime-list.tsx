import { AnimeCard } from '@/components/anime-card';
import type { Anime } from '@/types/anime';

interface AnimeListProps {
    animes: Anime[];
    showBadge?: boolean;
}

export function AnimeList({ animes, showBadge = false }: AnimeListProps) {
    if (!animes) return null;
    return (
        <div className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide md:flex-wrap justify-between md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6  border-b-2 border-b-background/10 justify-items-center-safe  rounded-md'>
            {animes.map((anime) => (
                <div
                    key={`${anime.title}-${anime.mal_id}`}
                    className='w-[160px] flex-shrink-0 sm:w-[180px]'
                >
                    <AnimeCard anime={anime} showBadge={showBadge} />
                </div>
            ))}
        </div>
    );
}
