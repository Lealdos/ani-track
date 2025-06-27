import { Anime } from "@/types/anime";

const FAV_KEY = "AniTrack-Favorites-Animes";

export function getStoredFavoriteAnimes() {
  const value = localStorage.getItem(FAV_KEY);
  return value ? JSON.parse(value) : [];
}

export function storeFavoriteAnimes(favorites:Anime[]) {
  localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
}

/*

personajes de un anime

https://api.jikan.moe/v4/anime/1/characters

*/