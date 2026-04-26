'use client'
import { JikanAnime } from '@/services/JikanAPI/interfaces/JikanType'

const FAV_KEY = 'Favorites-Animes'

export function getStoredFavoriteAnimes() {
    if (globalThis.window === undefined) return []
    const FavoriteAnimeList = localStorage.getItem(FAV_KEY)
    return FavoriteAnimeList ? JSON.parse(FavoriteAnimeList) : []
}

export function storeFavoriteAnimes(favorites: JikanAnime[]) {
    if (globalThis.window === undefined) return
    localStorage.setItem(FAV_KEY, JSON.stringify(favorites))
}

/*

character api

https://api.jikan.moe/v4/anime/1/characters

*/
