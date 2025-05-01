'use client'

import { getAnimeByGenre } from '@/lib/api'
import { AnimeList } from '@/components/AnimeList/AnimeList'
import { useState, useEffect } from 'react'
import { Anime } from '@/types/anime'
import { AnimeListSkeleton } from '@/components/ui/SkeletonCard/AnimeSkeletonList'
export function GenreSelect({ genreId }: { genreId: number }) {
    const [animes, setAnimes] = useState<Anime[]>([])

    useEffect(() => {
        const fetchAnimes = async () => {
            const data = await getAnimeByGenre(genreId)
            setAnimes(data)
        }
        fetchAnimes()
    }, [genreId])

    return animes.length === 0 ? (
        <AnimeListSkeleton sectionName="anime-by-genre" skeletonItemCount={6} />
    ) : (
        <AnimeList animes={animes} showBadge SectionName="anime-by-genre" />
    )
}
