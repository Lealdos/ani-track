'use client';

import { getAnimeByGenre } from '@/lib/api';
import { AnimeList } from '@/components/anime-list';
import { useState, useEffect } from 'react';
import { Anime } from '@/types/anime';
import { AnimeListSkeleton } from '@/components/ui/AnimeSkeleton/AnimeSkeleton';
export function GenreSelect({ genreId }: { genreId: number }) {
    const [animes, setAnimes] = useState<Anime[]>([]);

    useEffect(() => {
        const fetchAnimes = async () => {
            const data = await getAnimeByGenre(genreId);
            setAnimes(data);
        };
        fetchAnimes();
    }, [genreId]);

    return animes.length === 0 ? (
        <AnimeListSkeleton />
    ) : (
        <AnimeList animes={animes} showBadge />
    );
}
