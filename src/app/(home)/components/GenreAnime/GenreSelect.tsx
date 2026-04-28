'use client'

import { getAnimeByGenreAction } from '@/entities/anime/api/actions'
import { AnimeList } from '@/components/shared/AnimeList/AnimeList'
import { useState, useEffect } from 'react'
import { Anime } from '@/entities/anime/models'
import { AnimeListSkeleton } from '@/components/shared/SkeletonCard/AnimeSkeletonList'
export function GenreSelect({ genreId }: { genreId: number }) {
    const [animes, setAnimes] = useState<Anime[]>([])

    useEffect(() => {
        const fetchAnimes = async () => {
            const data = await getAnimeByGenreAction(genreId)
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
