/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Save, Trash2, Globe, Lock, Loader2, X } from 'lucide-react'
import { Link, useRouter } from '@/i18n/navigation'
import { toast } from 'sonner'
import { ShareButton } from '@/components/shared/ShareButton/ShareButton'

type AnimeItem = {
    id: string
    animeId: string
    title: string
    picture: string
}

type UserListDetail = {
    id: string
    name: string
    visibility: 'PUBLIC' | 'PRIVATE'
    listItems: AnimeItem[]
}

export function EditUserList({ listId }: { listId: string }) {
    const t = useTranslations('Lists')
    const router = useRouter()
    const [list, setList] = useState<UserListDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [name, setName] = useState('')
    const [visibility, setVisibility] = useState<'PUBLIC' | 'PRIVATE'>(
        'PRIVATE'
    )
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [removingItemId, setRemovingItemId] = useState<string | null>(null)
    const [confirmDelete, setConfirmDelete] = useState(false)

    const fetchList = useCallback(async () => {
        try {
            const res = await fetch(`/api/users-lists/${listId}`, {
                credentials: 'include',
            })
            const json = await res.json()
            if (json.success && json.data) {
                setList(json.data)
                setName(json.data.name)
                setVisibility(json.data.visibility)
            }
        } catch {
            setList(null)
        } finally {
            setLoading(false)
        }
    }, [listId])

    useEffect(() => {
        fetchList()
    }, [fetchList])

    const hasChanges =
        list && (name !== list.name || visibility !== list.visibility)

    async function handleSave() {
        if (!hasChanges) return
        setSaving(true)
        try {
            const res = await fetch(`/api/users-lists/${listId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name, visibility }),
            })
            const json = await res.json()
            if (json.success && json.data) {
                setList(json.data)
                toast.success(t('listUpdated'))
            } else {
                toast.error(t('saveError'))
            }
        } catch {
            toast.error(t('saveError'))
        } finally {
            setSaving(false)
        }
    }

    async function handleDeleteList() {
        setDeleting(true)
        try {
            const res = await fetch(`/api/users-lists/${listId}`, {
                method: 'DELETE',
                credentials: 'include',
            })
            const json = await res.json()
            if (json.success) {
                toast.success(t('listDeleted'))
                router.push('/account/my-lists')
            } else {
                toast.error(t('deleteError'))
            }
        } catch {
            toast.error(t('deleteError'))
        } finally {
            setDeleting(false)
            setConfirmDelete(false)
        }
    }

    async function handleRemoveItem(itemId: string) {
        setRemovingItemId(itemId)
        try {
            const res = await fetch(
                `/api/users-lists/${listId}/items/${itemId}`,
                {
                    method: 'DELETE',
                    credentials: 'include',
                }
            )
            const json = await res.json()
            if (json.success) {
                setList((prev) =>
                    prev
                        ? {
                              ...prev,
                              listItems: prev.listItems.filter(
                                  (item) => item.id !== itemId
                              ),
                          }
                        : null
                )
                toast.success(t('animeRemoved'))
            } else {
                toast.error(t('removeAnimeError'))
            }
        } catch {
            toast.error(t('removeAnimeError'))
        } finally {
            setRemovingItemId(null)
        }
    }

    if (loading) {
        return <EditListSkeleton />
    }

    if (!list) {
        return (
            <div className="flex min-h-80 flex-col items-center justify-center gap-4">
                <p className="text-lg text-slate-300">{t('listNotFound')}</p>
                <Link
                    href="/account/my-lists"
                    className="text-sm text-cyan-400 hover:underline"
                >
                    {t('backToMyLists')}
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3">
                <Link
                    href="/account/my-lists"
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-2xl font-bold text-white md:text-3xl">
                    {t('editList')}
                </h1>
                <ShareButton
                    title={`${list.name} | AniTrack`}
                    text={t('shareListText', { name: list.name })}
                    label={t('shareList')}
                    className="ml-auto"
                    url={`${globalThis.location?.origin ?? ''}/anime/lists/${list.id}`}
                />
            </div>

            <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                    <div className="flex-1 space-y-2">
                        <label
                            htmlFor="list-name"
                            className="text-sm font-medium text-slate-300"
                        >
                            {t('listName')}
                        </label>
                        <Input
                            id="list-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border-slate-600 bg-slate-900/50 text-white"
                            maxLength={100}
                        />
                    </div>
                    <div className="space-y-2">
                        <label
                            htmlFor="list-visibility"
                            className="text-sm font-medium text-slate-300"
                        >
                            {t('visibility')}
                        </label>
                        <div className="relative">
                            <select
                                id="list-visibility"
                                value={visibility}
                                onChange={(e) =>
                                    setVisibility(
                                        e.target.value as 'PUBLIC' | 'PRIVATE'
                                    )
                                }
                                className="h-9 w-full appearance-none rounded-md border border-slate-600 bg-slate-900/50 px-3 pr-8 text-sm text-white outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                            >
                                <option value="PRIVATE">{t('private')}</option>
                                <option value="PUBLIC">{t('public')}</option>
                            </select>
                            {visibility === 'PUBLIC' ? (
                                <Globe className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                            ) : (
                                <Lock className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                            )}
                        </div>
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={!hasChanges || saving}
                        className="bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-40"
                    >
                        {saving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        {t('saveChanges')}
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">
                        {t('animesCount', { count: list.listItems.length })}
                    </h2>
                </div>

                {list.listItems.length === 0 ? (
                    <div className="flex min-h-40 items-center justify-center rounded-xl border border-slate-700/50 bg-slate-800/30">
                        <p className="text-sm text-slate-400">
                            {t('noAnimesYet')}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {list.listItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center gap-4 rounded-lg border border-slate-700/50 bg-slate-800/30 p-3 transition-colors hover:bg-slate-800/50"
                            >
                                <Link
                                    href={`/anime/${item.animeId}`}
                                    className="flex flex-1 items-center gap-4"
                                >
                                    <div className="bg-muted h-16 w-12 shrink-0 overflow-hidden rounded-md">
                                        <img
                                            src={
                                                item.picture ||
                                                '/placeholder.svg'
                                            }
                                            alt={item.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <span className="line-clamp-2 text-sm font-medium text-slate-200">
                                        {item.title}
                                    </span>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    onClick={() => handleRemoveItem(item.id)}
                                    disabled={removingItemId === item.id}
                                    className="shrink-0 text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                                >
                                    {removingItemId === item.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <X className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
                <h3 className="text-base font-semibold text-red-400">
                    {t('dangerZone')}
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                    {t('deleteWarning')}
                </p>
                {confirmDelete ? (
                    <div className="mt-4 flex items-center gap-3">
                        <Button
                            variant="destructive"
                            onClick={handleDeleteList}
                            disabled={deleting}
                        >
                            {deleting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Trash2 className="h-4 w-4" />
                            )}
                            {t('confirmDelete')}
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setConfirmDelete(false)}
                            className="text-slate-400"
                        >
                            {t('cancel')}
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="outline"
                        onClick={() => setConfirmDelete(true)}
                        className="mt-4 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    >
                        <Trash2 className="h-4 w-4" />
                        {t('deleteList')}
                    </Button>
                )}
            </div>
        </div>
    )
}

function EditListSkeleton() {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-lg bg-gray-700" />
                <Skeleton className="h-8 w-40 bg-gray-700" />
            </div>
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-20 bg-gray-700" />
                        <Skeleton className="h-9 w-full bg-gray-700" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16 bg-gray-700" />
                        <Skeleton className="h-9 w-32 bg-gray-700" />
                    </div>
                    <Skeleton className="h-9 w-32 bg-gray-700" />
                </div>
            </div>
            <div className="space-y-4">
                <Skeleton className="h-6 w-32 bg-gray-700" />
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton
                        key={`item-skeleton-${i + 1}`}
                        className="h-19 w-full rounded-lg bg-gray-700"
                    />
                ))}
            </div>
        </div>
    )
}
