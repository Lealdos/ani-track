'use client';

import { useState } from 'react';
import { AnimeCard } from '@/components/anime-card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Anime } from '@/types/anime';

interface AnimeListProps {
    animes: Anime[];
    showBadge?: boolean;
}

export function AnimeList({ animes, showBadge = false }: AnimeListProps) {
    const [scrollPosition, setScrollPosition] = useState(0);
    const scrollAmount = 300;

    const handleScroll = (direction: 'left' | 'right') => {
        const container = document.getElementById('anime-scroll-container');
        if (!container) return;

        const newPosition =
            direction === 'left'
                ? Math.max(scrollPosition - scrollAmount, 0)
                : scrollPosition + scrollAmount;

        container.scrollTo({
            left: newPosition,
            behavior: 'smooth',
        });

        setScrollPosition(newPosition);
    };

    if (!animes) return null;
    return (
        <div className='relative'>
            <div
                id='anime-scroll-container'
                className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide'
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

            <div className='absolute left-0 top-1/2 hidden -translate-y-1/2 transform md:block'>
                <button
                    className='h-8 w-8 rounded-full bg-background/80 backdrop-blur'
                    onClick={() => handleScroll('left')}
                    disabled={scrollPosition <= 0}
                >
                    <ChevronLeft className='h-4 w-4' />
                    <span className='sr-only'>Scroll left</span>
                </button>
            </div>

            <div className='absolute right-0 top-1/2 hidden -translate-y-1/2 transform md:block'>
                <button
                    className='h-8 w-8 rounded-full bg-background/80 backdrop-blur'
                    onClick={() => handleScroll('right')}
                >
                    <ChevronRight className='h-4 w-4' />
                    <span className='sr-only'>Scroll right</span>
                </button>
            </div>
        </div>
    );
}
