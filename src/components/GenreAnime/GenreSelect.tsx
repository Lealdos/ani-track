'use client';

import { getAnimeByGenre } from '@/lib/api';
import { AnimeList } from '@/components/anime-list';
import { useState, useEffect } from 'react';
import { Anime } from '@/types/anime';

export function GenreSelect({ genreId }: { genreId: number }) {
    const [animes, setAnimes] = useState<Anime[]>([]);

    useEffect(() => {
        const fetchAnimes = async () => {
            const data = await getAnimeByGenre(genreId);
            setAnimes(data);
        };
        fetchAnimes();
    }, [genreId]);

    return <AnimeList animes={animes} />;
}
