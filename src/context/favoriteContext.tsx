'use client'
import { useState, useContext, createContext, useEffect } from 'react'
import type { JikanAnime } from '@/types/anime'
import {
    getStoredFavoriteAnimes,
    storeFavoriteAnimes,
} from '@/store/StorageFavoritesAnime'

type FavoriteContextType = {
    favorites: JikanAnime[]
    setFavorites?: (favorites: JikanAnime[]) => void
    isInFavorites: (animeId: number) => boolean
    addToFavorites: (anime: JikanAnime) => void
    removeFromFavorites: (animeId: number) => void
}
const FavoriteContext = createContext<FavoriteContextType>({
    favorites: [],
    setFavorites: () => {},
    isInFavorites: () => false,
    addToFavorites: () => {},
    removeFromFavorites: () => {},
})

const FavoriteProvider = ({ children }: { children: React.ReactNode }) => {
    const [favorites, setFavorites] = useState<JikanAnime[]>([])

    useEffect(() => {
        setFavorites(getStoredFavoriteAnimes())
    }, [])

    const isInFavorites = (animeId: number) => {
        return favorites.some((anime) => anime.mal_id === animeId)
    }

    const addToFavorites = (anime: JikanAnime) => {
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

    return (
        <FavoriteContext.Provider
            value={{
                favorites,
                isInFavorites,
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
