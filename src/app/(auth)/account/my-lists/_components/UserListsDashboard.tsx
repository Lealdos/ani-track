/* eslint-disable @next/next/no-img-element */
'use client'
import { useSession } from '@/lib/Auth/auth-clients'
import { useState, useEffect, useCallback } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import {
    Clock,
    CheckCircle2,
    Heart,
    TvMinimalPlay,
    List,
    ChevronRight,
    Globe,
    Lock,
    Trash2,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { ShareButton } from '@/components/shared/ShareButton/ShareButton'
import { redirect } from 'next/navigation'

const LIST_STATUSES = [
    {
        value: 'watching',
        label: 'watching',
        icon: Clock,
        endpoint: '/api/users-lists/current-watching',
    },
    {
        value: 'favorites',
        label: 'favorites',
        icon: Heart,
        endpoint: '/api/users-lists/favorites',
    },
    {
        value: 'plan to watch',
        label: 'plan to watch',
        icon: TvMinimalPlay,
        endpoint: '/api/users-lists/plan-to-watch',
    },
    {
        value: 'completed',
        label: 'completed',
        icon: CheckCircle2,
        endpoint: '/api/users-lists/finished-anime',
    },
    {
        value: 'user lists',
        label: 'user lists',
        icon: List,
        endpoint: '/api/users-lists',
    },
] as const

type ListStatus = (typeof LIST_STATUSES)[number]['value']

type AnimeItem = {
    id: string
    animeId: string
    title: string
    picture: string
}

type UserList = {
    id: string
    name: string
    visibility: string
    listItems: AnimeItem[]
}

export function UserListsDashboard() {
    const { data: session, isPending } = useSession()
    const [activeTab, setActiveTab] = useState<ListStatus>('watching')
    const [items, setItems] = useState<AnimeItem[]>([])
    const [userLists, setUserLists] = useState<UserList[]>([])
    const [loading, setLoading] = useState(true)

    const fetchData = useCallback(async (tab: ListStatus) => {
        setLoading(true)
        const status = LIST_STATUSES.find((s) => s.value === tab)
        if (!status) return

        try {
            const res = await fetch(status.endpoint, {
                credentials: 'include',
            })
            const json = await res.json()

            if (tab === 'user lists') {
                setUserLists(json.data ?? [])
                setItems([])
            } else {
                setItems(json.data ?? [])
                setUserLists([])
            }
        } catch {
            setItems([])
            setUserLists([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (session?.user) {
            fetchData(activeTab)
        }
    }, [activeTab, session?.user, fetchData])

    const removeItem = useCallback(
        async (item: AnimeItem) => {
            const status = LIST_STATUSES.find((s) => s.value === activeTab)
            if (!status || activeTab === 'user lists') return

            const previousItems = items
            setItems((prev) => prev.filter((i) => i.id !== item.id))

            try {
                const res =
                    activeTab === 'favorites'
                        ? await fetch(status.endpoint, {
                              method: 'DELETE',
                              credentials: 'include',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ animeId: item.animeId }),
                          })
                        : await fetch(`${status.endpoint}/${item.id}`, {
                              method: 'DELETE',
                              credentials: 'include',
                          })
                if (!res.ok) throw new Error('Failed to delete')
            } catch {
                setItems(previousItems)
            }
        },
        [activeTab, items]
    )

    if (isPending) {
        return <DashboardSkeleton />
    }

    if (!session?.user) {
        return redirect('/login')
    }

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white md:text-4xl">
                    My lists
                </h1>
            </div>

            <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as ListStatus)}
                className="w-full"
            >
                <TabsList className="mb-6 flex w-full flex-wrap justify-start gap-2 bg-transparent p-0">
                    {LIST_STATUSES.map((listStatus) => (
                        <TabsTrigger
                            key={listStatus.value}
                            value={listStatus.value}
                            className="rounded-lg bg-slate-700/80 px-6 py-2.5 text-base font-medium text-white capitalize transition-all hover:bg-slate-700 data-[state=active]:bg-cyan-500 data-[state=active]:text-gray-900 data-[state=active]:shadow-lg"
                        >
                            <listStatus.icon className="mr-2 h-4 w-4" />
                            {listStatus.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {LIST_STATUSES.map((status) => (
                    <TabsContent
                        key={status.value}
                        value={status.value}
                        className="mt-6"
                    >
                        <TabContentBody
                            loading={loading}
                            status={status.value}
                            items={items}
                            userLists={userLists}
                            onRemoveItem={removeItem}
                        />
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}

function TabContentBody({
    loading,
    status,
    items,
    userLists,
    onRemoveItem,
}: {
    loading: boolean
    status: ListStatus
    items: AnimeItem[]
    userLists: UserList[]
    onRemoveItem: (item: AnimeItem) => void
}) {
    if (loading) return <ItemsGridSkeleton />
    if (status === 'user lists') return <UserListsContent lists={userLists} />
    if (items.length === 0) return <EmptyState />
    return <AnimeItemsGrid items={items} onRemoveItem={onRemoveItem} />
}

function AnimeItemsGrid({
    items,
    onRemoveItem,
}: {
    items: AnimeItem[]
    onRemoveItem: (item: AnimeItem) => void
}) {
    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {items.map((item) => (
                <AnimeItemCard
                    key={item.id}
                    item={item}
                    onRemove={onRemoveItem}
                />
            ))}
        </div>
    )
}

function AnimeItemCard({
    item,
    onRemove,
}: {
    item: AnimeItem
    onRemove: (item: AnimeItem) => void
}) {
    return (
        <div className="shadow-soft transition-silk group relative overflow-hidden rounded-lg bg-card hover:-translate-y-1 hover:shadow-petal">
            <Link href={`/anime/${item.animeId}`} className="relative block">
                <div className="relative aspect-2/3 overflow-hidden bg-muted">
                    <img
                        src={item.picture || '/placeholder.svg'}
                        alt={`${item.title} poster`}
                        loading="lazy"
                        className="transition-silk h-full w-full object-cover group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-background via-background/30 to-transparent opacity-90" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-3">
                    <h3 className="font-display line-clamp-2 text-base leading-tight text-foreground transition-colors group-hover:text-primary md:text-lg">
                        {item.title}
                    </h3>
                </div>
            </Link>
            <button
                type="button"
                onClick={() => onRemove(item)}
                aria-label={`Remove ${item.title}`}
                className="absolute top-2 right-2 z-10 cursor-pointer rounded-full bg-slate-900/80 p-1.5 text-white opacity-0 backdrop-blur transition-all group-hover:opacity-100 hover:bg-red-600 focus:opacity-100"
            >
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
    )
}

function UserListsContent({ lists }: { lists: UserList[] }) {
    if (lists.length === 0) {
        return <EmptyState />
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lists.map((list) => (
                <div
                    key={list.id}
                    className="group flex flex-col gap-3 rounded-xl border border-slate-700/50 bg-slate-800/30 p-5 transition-all hover:border-cyan-500/40 hover:bg-slate-800/60"
                >
                    <Link
                        href={`/account/my-lists/${list.id}`}
                        className="flex flex-col gap-3"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-white group-hover:text-cyan-400">
                                {list.name}
                            </h2>
                            <ChevronRight className="h-5 w-5 text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:text-cyan-400" />
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-700/60 px-2.5 py-1 text-xs text-slate-300">
                                <List className="h-3 w-3" />
                                {list.listItems.length} anime
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-700/60 px-2.5 py-1 text-xs text-slate-400 capitalize">
                                {list.visibility === 'PUBLIC' ? (
                                    <Globe className="h-3 w-3" />
                                ) : (
                                    <Lock className="h-3 w-3" />
                                )}
                                {list.visibility.toLowerCase()}
                            </span>
                        </div>
                    </Link>
                    <div className="flex justify-end">
                        {list.visibility === 'PUBLIC' && (
                            <ShareButton
                                title={`${list.name} | AniTrack`}
                                text={`Check out my anime list: ${list.name}`}
                                url={`${globalThis.location?.origin ?? ''}/anime/lists/${list.id}`}
                                size="sm"
                                variant="ghost"
                                label="Share list"
                            />
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

function EmptyState() {
    return (
        <div className="flex min-h-100 flex-col items-center justify-center rounded-xl border border-slate-700/50 bg-slate-800/30 p-12">
            <div className="mb-4 rounded-full bg-slate-700/50 p-6">
                <TvMinimalPlay className="h-12 w-12 text-slate-400" />
            </div>
            <p className="text-lg font-medium text-slate-300">empty list</p>
            <p className="mt-2 text-sm text-slate-400">
                no animes in this list
            </p>
        </div>
    )
}

function ItemsGridSkeleton() {
    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
                <div
                    key={`skeleton-${i + 1}-anime-item`}
                    className="relative overflow-hidden rounded-lg bg-card"
                >
                    <Skeleton className="aspect-2/3 w-full rounded-none bg-slate-700/60" />
                    <div className="absolute inset-x-0 bottom-0 space-y-2 p-3">
                        <Skeleton className="h-4 w-3/4 bg-slate-600/70" />
                        <Skeleton className="h-4 w-1/2 bg-slate-600/70" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export function DashboardSkeleton() {
    const tabWidths = ['w-32', 'w-32', 'w-40', 'w-36', 'w-36'] as const

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-8">
            <div className="mb-8">
                <Skeleton className="h-9 w-40 bg-slate-700/80 md:h-10 md:w-48" />
            </div>
            <div className="w-full">
                <div className="mb-6 flex w-full flex-wrap justify-start gap-2">
                    {tabWidths.map((width, i) => (
                        <Skeleton
                            key={`skeleton-tab-${i + 1}`}
                            className={`h-11 ${width} rounded-lg bg-slate-700/80`}
                        />
                    ))}
                </div>
                <div className="mt-6">
                    <ItemsGridSkeleton />
                </div>
            </div>
        </div>
    )
}
