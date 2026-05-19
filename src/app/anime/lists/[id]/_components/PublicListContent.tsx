/* eslint-disable @next/next/no-img-element */
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Lock, User } from 'lucide-react'

import { UserListsService } from '@/app/api/users-lists/_services/userListsService'
import { ShareButton } from '@/components/shared/ShareButton/ShareButton'
import { AnimeCard } from '@/components/shared/AnimeCard/AnimeCard'
import { Skeleton } from '@/components/ui/skeleton'
import { animeFromListItem } from '@/entities/anime/models'

export async function PublicListContent({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const result = await UserListsService.getPublicById(id)

    if (result.status === 'not-found') notFound()

    if (result.status === 'private') {
        return (
            <div className="container m-auto flex max-w-md flex-col items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/30 p-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-700/60">
                    <Lock className="h-5 w-5 text-slate-300" />
                </div>
                <h1 className="text-lg font-semibold text-white">
                    This list is private
                </h1>
                <p className="text-sm text-slate-400">
                    The owner has set this list as private, so only they can
                    view it.
                </p>
                <Link
                    href="/"
                    className="mt-2 inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-700"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to home
                </Link>
            </div>
        )
    }

    const { list } = result
    const ownerHandle = list.user.userName || list.user.name

    return (
        <div className="m-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12">
            <div className="flex flex-row items-center gap-3">
                <Link
                    href="/"
                    aria-label="Back to home"
                    className="rounded-lg bg-slate-900/30 p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                >
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <h1 className="text-xl font-bold text-white capitalize">
                    List name: {list.name}
                </h1>
                <div className="min-w-0 flex-1">
                    <p className="mt-1 text-xs text-white">
                        {list.listItems.length}{' '}
                        {list.listItems.length === 1 ? 'anime' : 'animes'}
                    </p>
                </div>
                <ShareButton
                    title={`${list.name} | AniTrack`}
                    text={`Check out this anime list by @${ownerHandle}: ${list.name}`}
                    label="Share list"
                />
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-700">
                    {list.user.image ? (
                        <img
                            src={list.user.image}
                            alt={`${list.user.name} avatar`}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <User className="h-5 w-5 text-slate-300" />
                    )}
                </div>
                <div className="min-w-0">
                    <p className="text-xs text-slate-400">Created by</p>
                    <p className="truncate text-sm font-medium text-white">
                        {list.user.userName
                            ? `@${list.user.userName}`
                            : list.user.name}
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white">
                    Animes ({list.listItems.length})
                </h2>

                {list.listItems.length === 0 ? (
                    <div className="flex min-h-40 items-center justify-center rounded-xl border border-slate-700/50 bg-slate-800/30">
                        <p className="text-sm text-slate-400">
                            This list is empty
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {list.listItems.map((item) => (
                            <AnimeCard
                                key={item.id}
                                anime={animeFromListItem(item)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export function PublicListSkeleton() {
    return (
        <div className="m-auto flex w-full max-w-5xl flex-col gap-8 space-y-8 px-4 py-12">
            <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-lg bg-gray-700" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-7 w-1/2 bg-gray-700" />
                    <Skeleton className="h-3 w-20 bg-gray-700" />
                </div>
                <Skeleton className="h-9 w-28 bg-gray-700" />
            </div>
            <Skeleton className="h-18 w-full rounded-xl bg-gray-700" />
            <div className="space-y-4">
                <Skeleton className="h-6 w-32 bg-gray-700" />
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <Skeleton
                            key={`card-skeleton-${i + 1}`}
                            className="aspect-2/3 w-full rounded-lg bg-gray-700"
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
