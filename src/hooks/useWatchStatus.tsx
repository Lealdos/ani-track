'use client'
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
import { useSession } from '@/lib/Auth/auth-clients'

export type WatchStatus = 'watching' | 'plan_to_watch' | 'completed'

export type StatusEntry = FavoriteAnime & {
    status: WatchStatus
    updatedAt: number
    dbId?: string
}

type Store = Record<number, StatusEntry>

type WatchStatusContextValue = {
    entries: StatusEntry[]
    byStatus: (s: WatchStatus) => StatusEntry[]
    getStatus: (id: number) => WatchStatus | null
    setStatus: (anime: FavoriteAnime, status: WatchStatus) => void
    clearStatus: (id: number) => void
}

const Ctx = createContext<WatchStatusContextValue | null>(null)

const STATUS_ENDPOINTS: Record<WatchStatus, string> = {
    watching: '/api/users-lists/current-watching',
    plan_to_watch: '/api/users-lists/plan-to-watch',
    completed: '/api/users-lists/finished-anime',
}

type DbItem = {
    id: string
    animeId: string
    title: string
    picture: string
    createdAt: string
}

function imgOf(anime: FavoriteAnime): string {
    return (
        anime.images?.webp?.largeImageUrl ||
        anime.images?.jpg?.largeImageUrl ||
        anime.images?.webp?.imageUrl ||
        anime.images?.jpg?.imageUrl ||
        ''
    )
}

function dbItemToEntry(item: DbItem, status: WatchStatus): StatusEntry {
    return {
        id: Number.parseInt(item.animeId),
        title: item.title,
        images: item.picture
            ? {
                  jpg: {
                      imageUrl: item.picture,
                      largeImageUrl: item.picture,
                      smallImageUrl: item.picture,
                  },
              }
            : undefined,
        status,
        updatedAt: new Date(item.createdAt).getTime(),
        dbId: item.id,
    }
}

async function fetchStatus(status: WatchStatus): Promise<StatusEntry[]> {
    const res = await fetch(STATUS_ENDPOINTS[status])
    if (!res.ok) return []
    const { data } = await res.json()
    return (data as DbItem[]).map((item) => dbItemToEntry(item, status))
}

export function WatchStatusProvider({ children }: { children: ReactNode }) {
    const { data: session, isPending } = useSession()
    const isAuthenticated = !!session?.user?.id
    const [store, setStore] = useState<Store>({})

    useEffect(() => {
        if (isPending || !isAuthenticated) {
            setStore({})
            return
        }

        let cancelled = false
        const load = async () => {
            const [watching, planned, finished] = await Promise.all([
                fetchStatus('watching'),
                fetchStatus('plan_to_watch'),
                fetchStatus('completed'),
            ])
            if (cancelled) return
            const merged: Store = {}
            for (const entry of [...watching, ...planned, ...finished]) {
                merged[entry.id] = entry
            }
            setStore(merged)
        }
        load()
        return () => {
            cancelled = true
        }
    }, [isPending, isAuthenticated])

    const entries = useMemo(
        () => Object.values(store).sort((a, b) => b.updatedAt - a.updatedAt),
        [store]
    )

    const byStatus = useCallback(
        (s: WatchStatus) => entries.filter((e) => e.status === s),
        [entries]
    )

    const getStatus = useCallback(
        (id: number) => (store[id]?.status ?? null) as WatchStatus | null,
        [store]
    )

    const setStatus = useCallback(
        (anime: FavoriteAnime, status: WatchStatus) => {
            const prev = store[anime.id]
            const optimistic: StatusEntry = {
                id: anime.id,
                title: anime.title,
                images: anime.images,
                status,
                updatedAt: Date.now(),
            }

            setStore((s) => ({ ...s, [anime.id]: optimistic }))

            const payload = {
                animeId: String(anime.id),
                title: anime.title,
                picture: imgOf(anime),
            }

            const apply = async () => {
                if (prev?.dbId) {
                    await fetch(
                        `${STATUS_ENDPOINTS[prev.status]}/${prev.dbId}`,
                        { method: 'DELETE' }
                    )
                }
                const res = await fetch(STATUS_ENDPOINTS[status], {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                })
                if (!res.ok) throw new Error('Failed to set status')
                const { data } = await res.json()
                setStore((s) => ({
                    ...s,
                    [anime.id]: {
                        ...optimistic,
                        dbId: (data as DbItem).id,
                    },
                }))
            }

            apply().catch(() => {
                if (prev) {
                    setStore((s) => ({ ...s, [anime.id]: prev }))
                } else {
                    setStore((s) => {
                        const next = { ...s }
                        delete next[anime.id]
                        return next
                    })
                }
            })
        },
        [store]
    )

    const clearStatus = useCallback(
        (id: number) => {
            const prev = store[id]
            if (!prev) return

            setStore((s) => {
                const next = { ...s }
                delete next[id]
                return next
            })

            if (prev.dbId) {
                fetch(`${STATUS_ENDPOINTS[prev.status]}/${prev.dbId}`, {
                    method: 'DELETE',
                }).catch(() => {
                    setStore((s) => ({ ...s, [id]: prev }))
                })
            }
        },
        [store]
    )

    const value = useMemo(
        () => ({ entries, byStatus, getStatus, setStatus, clearStatus }),
        [entries, byStatus, getStatus, setStatus, clearStatus]
    )

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useWatchStatus() {
    const ctx = useContext(Ctx)
    if (!ctx)
        throw new Error(
            'useWatchStatus must be used inside WatchStatusProvider'
        )
    return ctx
}
