'use client'
import {
    useState,
    useContext,
    createContext,
    useEffect,
    useMemo,
    useCallback,
    useRef,
} from 'react'
import type { JikanAnime } from '@/services/JikanAPI/interfaces/JikanType'
import {
    getStoredFavoriteAnimes,
    storeFavoriteAnimes,
} from '@/store/StorageFavoritesAnime'
import { useSession } from '@/lib/Auth/auth-clients'

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

type DbFavorite = {
    id: string
    animeId: string
    title: string
    picture: string
}

function dbToJikanAnime(item: DbFavorite): JikanAnime {
    return {
        mal_id: parseInt(item.animeId),
        title: item.title,
        images: {
            jpg: {
                image_url: item.picture,
                large_image_url: item.picture,
                small_image_url: item.picture,
            },
        },
        score: 0,
        rank: 0,
        demographics: [],
        relations: [],
    } as JikanAnime
}

function imgOf(anime: JikanAnime): string {
    return (
        anime.images?.webp?.large_image_url ||
        anime.images?.jpg?.large_image_url ||
        anime.images?.webp?.image_url ||
        anime.images?.jpg?.image_url ||
        ''
    )
}

const FavoriteProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: session, isPending } = useSession()
    const isAuthenticated = !!session?.user?.id
    const [favorites, setFavorites] = useState<JikanAnime[]>([])
    const prevAuthRef = useRef<boolean | null>(null)
    const syncedRef = useRef(false)

    // --- Anonymous mode: load from localStorage ---
    useEffect(() => {
        if (isPending) return
        if (!isAuthenticated) {
            setFavorites(getStoredFavoriteAnimes())
            syncedRef.current = false
        }
    }, [isPending, isAuthenticated])

    // --- Authenticated mode: sync localStorage → DB on login, then fetch ---
    useEffect(() => {
        if (isPending) return

        const wasAnonymous = prevAuthRef.current === false
        prevAuthRef.current = isAuthenticated

        if (!isAuthenticated) return

        if (syncedRef.current) return
        syncedRef.current = true

        const init = async () => {
            if (wasAnonymous) {
                const localFavs: JikanAnime[] = getStoredFavoriteAnimes()
                if (localFavs.length > 0) {
                    const items = localFavs.map((a) => ({
                        animeId: String(a.mal_id),
                        title: a.title,
                        picture: imgOf(a),
                    }))
                    try {
                        const res = await fetch(
                            '/api/users-lists/favorites/sync',
                            {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ items }),
                            }
                        )
                        if (res.ok) {
                            const { data } = await res.json()
                            setFavorites(
                                (data as DbFavorite[]).map(dbToJikanAnime)
                            )
                            storeFavoriteAnimes([])
                            return
                        }
                    } catch {
                        // fall through to normal fetch
                    }
                }
                storeFavoriteAnimes([])
            }

            try {
                const res = await fetch('/api/users-lists/favorites')
                if (res.ok) {
                    const { data } = await res.json()
                    setFavorites((data as DbFavorite[]).map(dbToJikanAnime))
                }
            } catch {
                // network error — keep empty state
            }
        }

        init()
    }, [isPending, isAuthenticated])

    // --- On logout: clear in-memory state ---
    useEffect(() => {
        if (isPending) return
        if (prevAuthRef.current === true && !isAuthenticated) {
            setFavorites([])
        }
    }, [isPending, isAuthenticated])

    const isInFavorites = useCallback(
        (animeId: number) => {
            return favorites.some((anime) => anime.mal_id === animeId)
        },
        [favorites]
    )

    const addToFavorites = useCallback(
        (anime: JikanAnime) => {
            if (favorites.some((f) => f.mal_id === anime.mal_id)) return

            if (isAuthenticated) {
                const picture = imgOf(anime)
                setFavorites((prev) => [...prev, anime])
                fetch('/api/users-lists/favorites', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        animeId: String(anime.mal_id),
                        title: anime.title,
                        picture,
                    }),
                }).catch(() => {
                    setFavorites((prev) =>
                        prev.filter((f) => f.mal_id !== anime.mal_id)
                    )
                })
            } else {
                const newFavorites = [...favorites, anime]
                setFavorites(newFavorites)
                storeFavoriteAnimes(newFavorites)
            }
        },
        [favorites, isAuthenticated]
    )

    const removeFromFavorites = useCallback(
        (animeId: number) => {
            if (isAuthenticated) {
                const removed = favorites.find((f) => f.mal_id === animeId)
                setFavorites((prev) =>
                    prev.filter((fav) => fav.mal_id !== animeId)
                )
                fetch('/api/users-lists/favorites', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ animeId: String(animeId) }),
                }).catch(() => {
                    if (removed) {
                        setFavorites((prev) => [...prev, removed])
                    }
                })
            } else {
                const newFavorites = favorites.filter(
                    (fav) => fav.mal_id !== animeId
                )
                setFavorites(newFavorites)
                storeFavoriteAnimes(newFavorites)
            }
        },
        [favorites, isAuthenticated]
    )

    const contextValue = useMemo(
        () => ({
            favorites,
            isInFavorites,
            addToFavorites,
            removeFromFavorites,
        }),
        [favorites, isInFavorites, addToFavorites, removeFromFavorites]
    )

    return (
        <FavoriteContext.Provider value={contextValue}>
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
