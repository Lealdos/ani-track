import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { Anime } from "@/lib/jikan";

const STORAGE_KEY = "hanami-favorites";

export type FavoriteAnime = Pick<
  Anime,
  "mal_id" | "title" | "title_english" | "images" | "score" | "type" | "episodes" | "year"
>;

type FavoritesContextValue = {
  favorites: FavoriteAnime[];
  ids: Set<number>;
  isFavorite: (id: number) => boolean;
  toggle: (anime: FavoriteAnime) => void;
  remove: (id: number) => void;
  clear: () => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function load(): FavoriteAnime[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteAnime[]>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      /* quota exceeded — ignore */
    }
  }, [favorites]);

  // Sync across tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setFavorites(load());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const ids = useMemo(() => new Set(favorites.map((f) => f.mal_id)), [favorites]);

  const isFavorite = useCallback((id: number) => ids.has(id), [ids]);

  const toggle = useCallback((anime: FavoriteAnime) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.mal_id === anime.mal_id);
      if (exists) return prev.filter((f) => f.mal_id !== anime.mal_id);
      const slim: FavoriteAnime = {
        mal_id: anime.mal_id,
        title: anime.title,
        title_english: anime.title_english ?? null,
        images: anime.images,
        score: anime.score ?? null,
        type: anime.type ?? null,
        episodes: anime.episodes ?? null,
        year: anime.year ?? null,
      };
      return [slim, ...prev];
    });
  }, []);

  const remove = useCallback((id: number) => {
    setFavorites((prev) => prev.filter((f) => f.mal_id !== id));
  }, []);

  const clear = useCallback(() => setFavorites([]), []);

  const value = useMemo(
    () => ({ favorites, ids, isFavorite, toggle, remove, clear }),
    [favorites, ids, isFavorite, toggle, remove, clear]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside FavoritesProvider");
  return ctx;
}
