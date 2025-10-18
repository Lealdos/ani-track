'use client'

import { getAnimeByGenre } from '@/services/JikanAPI/jikanAnimeApi'
import { AnimeList } from '@/components/AnimeList/AnimeList'
import { useState, useEffect } from 'react'
import { JikanAnime } from '@/services/JikanAPI/interfaces/JikanType'
import { AnimeListSkeleton } from '@/components/SkeletonCard/AnimeSkeletonList'
export function GenreSelect({ genreId }: { genreId: number }) {
    const [animes, setAnimes] = useState<JikanAnime[]>([])

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
