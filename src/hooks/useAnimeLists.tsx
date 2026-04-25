import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    ReactNode,
} from 'react'
import { FavoriteAnime } from './useFavorites'

const STORAGE_KEY = 'hanami-lists'

export type AnimeList = {
    id: string
    name: string
    createdAt: number
    items: FavoriteAnime[]
}

type ListsContextValue = {
    lists: AnimeList[]
    createList: (name: string) => AnimeList | null
    renameList: (id: string, name: string) => void
    deleteList: (id: string) => void
    addToList: (listId: string, anime: FavoriteAnime) => void
    removeFromList: (listId: string, animeId: number) => void
    getList: (id: string) => AnimeList | undefined
}

const ListsContext = createContext<ListsContextValue | null>(null)

function load(): AnimeList[] {
    if (typeof window === 'undefined') return []
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return []
        const parsed = JSON.parse(raw)
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

function slim(a: FavoriteAnime): FavoriteAnime {
    return {
        mal_id: a.mal_id,
        title: a.title,
        title_english: a.title_english ?? null,
        images: a.images,
        score: a.score ?? null,
        type: a.type ?? null,
        episodes: a.episodes ?? null,
        year: a.year ?? null,
    }
}

export function AnimeListsProvider({ children }: { children: ReactNode }) {
    const [lists, setLists] = useState<AnimeList[]>(load)

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(lists))
        } catch {
            /* ignore */
        }
    }, [lists])

    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY) setLists(load())
        }
        window.addEventListener('storage', onStorage)
        return () => window.removeEventListener('storage', onStorage)
    }, [])

    const createList = useCallback((name: string) => {
        const trimmed = name.trim()
        if (!trimmed) return null
        const list: AnimeList = {
            id: crypto.randomUUID(),
            name: trimmed,
            createdAt: Date.now(),
            items: [],
        }
        setLists((prev) => [list, ...prev])
        return list
    }, [])

    const renameList = useCallback((id: string, name: string) => {
        const trimmed = name.trim()
        if (!trimmed) return
        setLists((prev) =>
            prev.map((l) => (l.id === id ? { ...l, name: trimmed } : l))
        )
    }, [])

    const deleteList = useCallback((id: string) => {
        setLists((prev) => prev.filter((l) => l.id !== id))
    }, [])

    const addToList = useCallback((listId: string, anime: FavoriteAnime) => {
        setLists((prev) =>
            prev.map((l) => {
                if (l.id !== listId) return l
                if (l.items.some((i) => i.mal_id === anime.mal_id)) return l
                return { ...l, items: [slim(anime), ...l.items] }
            })
        )
    }, [])

    const removeFromList = useCallback((listId: string, animeId: number) => {
        setLists((prev) =>
            prev.map((l) =>
                l.id === listId
                    ? {
                          ...l,
                          items: l.items.filter((i) => i.mal_id !== animeId),
                      }
                    : l
            )
        )
    }, [])

    const getList = useCallback(
        (id: string) => lists.find((l) => l.id === id),
        [lists]
    )

    const value = useMemo(
        () => ({
            lists,
            createList,
            renameList,
            deleteList,
            addToList,
            removeFromList,
            getList,
        }),
        [
            lists,
            createList,
            renameList,
            deleteList,
            addToList,
            removeFromList,
            getList,
        ]
    )

    return (
        <ListsContext.Provider value={value}>{children}</ListsContext.Provider>
    )
}

export function useAnimeLists() {
    const ctx = useContext(ListsContext)
    if (!ctx)
        throw new Error('useAnimeLists must be used inside AnimeListsProvider')
    return ctx
}
