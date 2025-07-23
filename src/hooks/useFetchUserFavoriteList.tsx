'use client'
import { useState } from 'react'
import type { Anime } from '@/types/anime'
import {
    getStoredFavoriteAnimes,
    storeFavoriteAnimes,
} from '@/store/StorageFavoritesAnime'

export function useFavoriteAnimes() {
    const [favorites, setFavorites] = useState<Anime[]>(
        () => getStoredFavoriteAnimes() || []
    )

    const isInFavorites = (animeId: number) => {
        return favorites.some((anime) => anime.mal_id === animeId)
    }

    const addToFavorites = (anime: Anime) => {
        if (isInFavorites(anime.mal_id)) {
            return
        }
        const newFavorites = [...favorites, anime]
        setFavorites(newFavorites)
        storeFavoriteAnimes(newFavorites)
    }

    const removeFromFavorites = (animeId: number) => {
        const newFavorites = favorites.filter((fav) => fav.mal_id !== animeId)
        setFavorites(newFavorites)
        storeFavoriteAnimes(newFavorites)
    }

    const toggleFavorite = (anime: Anime) => {
        if (isInFavorites(anime.mal_id)) {
            removeFromFavorites(anime.mal_id)
        } else {
            addToFavorites(anime)
        }
    }

    return {
        favorites,
        isInFavorites,
        toggleFavorite,
        addToFavorites,
        removeFromFavorites,
    }
}
