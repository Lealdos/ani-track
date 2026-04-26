'use client'
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    ReactNode,
} from 'react'
import { FavoriteAnime } from './useFavorites'
import { useSession } from '@/lib/Auth/auth-clients'

export type AnimeList = {
    id: string
    name: string
    createdAt: number
    items: AnimeListItem[]
}

type AnimeListItem = FavoriteAnime & {
    dbItemId: string
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

const BASE = '/api/users-lists'

type DbListItem = {
    id: string
    animeId: string
    title: string
    picture: string
}

type DbList = {
    id: string
    name: string
    createdAt: string
    listItems: DbListItem[]
}

function dbItemToAnime(item: DbListItem): AnimeListItem {
    return {
        mal_id: Number.parseInt(item.animeId),
        title: item.title,
        images: item.picture
            ? {
                  jpg: {
                      image_url: item.picture,
                      large_image_url: item.picture,
                      small_image_url: item.picture,
                  },
              }
            : undefined,
        dbItemId: item.id,
    }
}

function dbListToAnimeList(list: DbList): AnimeList {
    return {
        id: list.id,
        name: list.name,
        createdAt: new Date(list.createdAt).getTime(),
        items: (list.listItems ?? []).map(dbItemToAnime),
    }
}

function imgOf(anime: FavoriteAnime): string {
    return (
        anime.images?.webp?.large_image_url ||
        anime.images?.jpg?.large_image_url ||
        anime.images?.webp?.image_url ||
        anime.images?.jpg?.image_url ||
        ''
    )
}

export function AnimeListsProvider({ children }: { children: ReactNode }) {
    const { data: session, isPending } = useSession()
    const isAuthenticated = !!session?.user?.id
    const [lists, setLists] = useState<AnimeList[]>([])
    const pendingIds = useRef(new Map<string, Promise<string>>())

    useEffect(() => {
        if (isPending || !isAuthenticated) {
            setLists([])
            return
        }

        let cancelled = false
        const load = async () => {
            const res = await fetch(BASE)
            if (!res.ok) return
            const { data } = await res.json()
            if (cancelled) return
            setLists((data as DbList[]).map(dbListToAnimeList))
        }
        load()
        return () => {
            cancelled = true
        }
    }, [isPending, isAuthenticated])

    function resolveListId(listId: string): Promise<string> {
        const pending = pendingIds.current.get(listId)
        if (pending) return pending
        return Promise.resolve(listId)
    }

    const createList = useCallback((name: string): AnimeList | null => {
        const trimmed = name.trim()
        if (!trimmed) return null

        const tempId = crypto.randomUUID()
        const optimistic: AnimeList = {
            id: tempId,
            name: trimmed,
            createdAt: Date.now(),
            items: [],
        }
        setLists((prev) => [optimistic, ...prev])

        const promise = fetch(BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: trimmed, visibility: 'PRIVATE' }),
        })
            .then(async (res) => {
                if (!res.ok) throw new Error('Failed to create list')
                const { data } = await res.json()
                const real = dbListToAnimeList(data as DbList)
                setLists((prev) =>
                    prev.map((l) => (l.id === tempId ? real : l))
                )
                return real.id
            })
            .catch(() => {
                setLists((prev) => prev.filter((l) => l.id !== tempId))
                throw new Error('Failed to create list')
            })
            .finally(() => {
                pendingIds.current.delete(tempId)
            })

        pendingIds.current.set(tempId, promise)
        return optimistic
    }, [])

    const renameList = useCallback((id: string, name: string) => {
        const trimmed = name.trim()
        if (!trimmed) return

        setLists((prev) =>
            prev.map((l) => (l.id === id ? { ...l, name: trimmed } : l))
        )

        resolveListId(id).then((realId) => {
            fetch(`${BASE}/${realId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: trimmed }),
            })
        })
    }, [])

    const deleteList = useCallback((id: string) => {
        setLists((prev) => {
            const backup = prev
            const next = prev.filter((l) => l.id !== id)

            resolveListId(id).then((realId) => {
                fetch(`${BASE}/${realId}`, { method: 'DELETE' }).catch(() => {
                    setLists(backup)
                })
            })

            return next
        })
    }, [])

    const addToList = useCallback((listId: string, anime: FavoriteAnime) => {
        const tempItemId = crypto.randomUUID()
        const optimisticItem: AnimeListItem = {
            mal_id: anime.mal_id,
            title: anime.title,
            images: anime.images,
            dbItemId: tempItemId,
        }

        setLists((prev) =>
            prev.map((l) => {
                if (l.id !== listId) return l
                if (l.items.some((i) => i.mal_id === anime.mal_id)) return l
                return { ...l, items: [optimisticItem, ...l.items] }
            })
        )

        resolveListId(listId).then((realId) => {
            fetch(`${BASE}/${realId}/items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    animeId: String(anime.mal_id),
                    title: anime.title,
                    picture: imgOf(anime),
                }),
            })
                .then(async (res) => {
                    if (!res.ok) throw new Error()
                    const { data } = await res.json()
                    const realItemId = (data as { id: string }).id
                    setLists((prev) =>
                        prev.map((l) => {
                            if (l.id !== listId && l.id !== realId) return l
                            return {
                                ...l,
                                items: l.items.map((i) =>
                                    i.dbItemId === tempItemId
                                        ? { ...i, dbItemId: realItemId }
                                        : i
                                ),
                            }
                        })
                    )
                })
                .catch(() => {
                    setLists((prev) =>
                        prev.map((l) => {
                            if (l.id !== listId && l.id !== realId) return l
                            return {
                                ...l,
                                items: l.items.filter(
                                    (i) => i.dbItemId !== tempItemId
                                ),
                            }
                        })
                    )
                })
        })
    }, [])

    const removeFromList = useCallback((listId: string, animeId: number) => {
        let removedItem: AnimeListItem | undefined

        setLists((prev) =>
            prev.map((l) => {
                if (l.id !== listId) return l
                removedItem = l.items.find((i) => i.mal_id === animeId)
                return {
                    ...l,
                    items: l.items.filter((i) => i.mal_id !== animeId),
                }
            })
        )

        if (removedItem?.dbItemId) {
            const itemId = removedItem.dbItemId
            resolveListId(listId).then((realId) => {
                fetch(`${BASE}/${realId}/items/${itemId}`, {
                    method: 'DELETE',
                }).catch(() => {
                    if (removedItem) {
                        const item = removedItem
                        setLists((prev) =>
                            prev.map((l) => {
                                if (l.id !== listId) return l
                                return { ...l, items: [item, ...l.items] }
                            })
                        )
                    }
                })
            })
        }
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
