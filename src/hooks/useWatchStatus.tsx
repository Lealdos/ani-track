import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { FavoriteAnime } from "./useFavorites";

const STORAGE_KEY = "hanami-watch-status";

export type WatchStatus = "watching" | "plan_to_watch" | "completed";

export type StatusEntry = FavoriteAnime & { status: WatchStatus; updatedAt: number };

type Store = Record<number, StatusEntry>;

type WatchStatusContextValue = {
  entries: StatusEntry[];
  byStatus: (s: WatchStatus) => StatusEntry[];
  getStatus: (id: number) => WatchStatus | null;
  setStatus: (anime: FavoriteAnime, status: WatchStatus) => void;
  clearStatus: (id: number) => void;
};

const Ctx = createContext<WatchStatusContextValue | null>(null);

function load(): Store {
  if (globalThis.window === undefined) return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function WatchStatusProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<Store>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch {
      /* ignore */
    }
  }, [store]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setStore(load());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const entries = useMemo(
    () => Object.values(store).sort((a, b) => b.updatedAt - a.updatedAt),
    [store]
  );

  const byStatus = useCallback(
    (s: WatchStatus) => entries.filter((e) => e.status === s),
    [entries]
  );

  const getStatus = useCallback(
    (id: number) => (store[id]?.status ?? null) as WatchStatus | null,
    [store]
  );

  const setStatus = useCallback((anime: FavoriteAnime, status: WatchStatus) => {
    setStore((prev) => ({
      ...prev,
      [anime.mal_id]: {
        mal_id: anime.mal_id,
        title: anime.title,
        title_english: anime.title_english ?? null,
        images: anime.images,
        score: anime.score ?? null,
        type: anime.type ?? null,
        episodes: anime.episodes ?? null,
        year: anime.year ?? null,
        status,
        updatedAt: Date.now(),
      },
    }));
  }, []);

  const clearStatus = useCallback((id: number) => {
    setStore((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ entries, byStatus, getStatus, setStatus, clearStatus }),
    [entries, byStatus, getStatus, setStatus, clearStatus]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWatchStatus() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWatchStatus must be used inside WatchStatusProvider");
  return ctx;
}
