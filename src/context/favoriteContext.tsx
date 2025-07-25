'use client'
import { useState, useContext, createContext, useEffect } from 'react'
import type { Anime } from '@/types/anime'
import {
    getStoredFavoriteAnimes,
    storeFavoriteAnimes,
} from '@/store/StorageFavoritesAnime'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FavoriteContext = createContext<any>({
    favorites: [],
    setFavorites: () => {},
    isInFavorites: () => {},
    addToFavorites: () => {},
    removeFromFavorites: () => {},
})

const FavoriteProvider = ({ children }: { children: React.ReactNode }) => {
    const [favorites, setFavorites] = useState<Anime[]>([])

    useEffect(() => {
        setFavorites(getStoredFavoriteAnimes())
    }, [])

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

    return (
        <FavoriteContext.Provider
            value={{
                favorites,
                isInFavorites,
                toggleFavorite,
                addToFavorites,
                removeFromFavorites,
            }}
        >
            {children}
        </FavoriteContext.Provider>
    )
}

const useFavorites = () => {
    const context = useContext(FavoriteContext)
    if (!context) {
        throw new Error('useFavorites must be used within a FavoriteProvider')
    }
    return context
}

export { useFavorites, FavoriteProvider }
