'use client'
import { Anime } from '@/types/anime'

const FAV_KEY = 'Favorites-Animes'

export function getStoredFavoriteAnimes() {
    if (typeof window === 'undefined') return []
    const FavoriteAnimeList = localStorage.getItem(FAV_KEY)
    return FavoriteAnimeList ? JSON.parse(FavoriteAnimeList) : []
}

export function storeFavoriteAnimes(favorites: Anime[]) {
    if (typeof window === 'undefined') return
    localStorage.setItem(FAV_KEY, JSON.stringify(favorites))
}

/*

character api

https://api.jikan.moe/v4/anime/1/characters

*/
