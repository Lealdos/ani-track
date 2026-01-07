'use client'
import { useSession } from '@/lib/Auth/auth-clients'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { TvMinimalPlay } from 'lucide-react'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

// List status types matching common anime tracking apps
const LIST_STATUSES = [
    {
        value: 'watching',
        label: 'watching',
        color: 'bg-slate-700/80 hover:bg-slate-700',
    },
    {
        value: 'plan to watch',
        label: 'plan to watch',
        color: 'bg-slate-700/80 hover:bg-slate-700',
    },
    {
        value: 'completed',
        label: 'completed',
        color: 'bg-slate-700/80 hover:bg-slate-700',
    },
    {
        value: 'onHold',
        label: 'onHold',
        color: 'bg-slate-700/80 hover:bg-slate-700',
    },
    {
        value: 'dropped',
        label: 'dropped',
        color: 'bg-slate-700/80 hover:bg-slate-700',
    },
] as const

type ListStatus = (typeof LIST_STATUSES)[number]['value']

const userLists = async (userId: string) => {
    const lists = await fetch(`/api/users-lists`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
        .then((res) => res.json())
        .then((data) => data.data)

    return lists
}

export function UserListsDashboard() {
    const { data: session, isPending } = useSession()

    if (isPending) {
        return (
            <div className="mx-auto min-h-screen w-full max-w-7xl px-4 py-8">
                {/* Title skeleton */}
                <div className="mb-8">
                    <Skeleton className="h-9 w-32 bg-gray-700 md:h-10 md:w-40" />
                </div>

                {/* Tabs skeleton */}
                <div className="w-full">
                    {/* Tabs list skeleton */}
                    <div className="mb-6 flex w-full flex-wrap justify-start gap-2">
                        <Skeleton className="h-10 w-28 rounded-lg bg-gray-700" />
                        <Skeleton className="h-10 w-36 rounded-lg bg-gray-700" />
                        <Skeleton className="h-10 w-32 rounded-lg bg-gray-700" />
                        <Skeleton className="h-10 w-24 rounded-lg bg-gray-700" />
                        <Skeleton className="h-10 w-28 rounded-lg bg-gray-700" />
                    </div>

                    {/* Tab content skeleton - Empty state */}
                    <div className="mt-6">
                        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-slate-700/50 bg-slate-800/30 p-12">
                            <Skeleton className="mb-4 h-24 w-24 rounded-full bg-gray-800" />
                            <Skeleton className="h-7 w-32 bg-gray-700" />
                            <Skeleton className="mt-2 h-5 w-48 bg-gray-700" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // ❌ NO redirect aquí
    if (!session?.user) {
        return null
    }

    return (
        <div className="mx-auto min-h-screen w-full max-w-7xl px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white md:text-4xl">
                    My lists
                </h1>
            </div>

            <Tabs defaultValue="watching" className="w-full">
                <TabsList className="mb-6 flex w-full flex-wrap justify-start gap-2 bg-transparent p-0">
                    {LIST_STATUSES.map((status) => (
                        <TabsTrigger
                            key={status.value}
                            value={status.value}
                            className={`rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-all data-[state=inactive]:${status.color} capitalize data-[state=active]:bg-cyan-500 data-[state=active]:text-gray-900 data-[state=active]:shadow-lg`}
                        >
                            {status.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {LIST_STATUSES.map((status) => (
                    <TabsContent
                        key={status.value}
                        value={status.value}
                        className="mt-6"
                    >
                        <EmptyState status={status.value} />
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}

function EmptyState({ status }: { status: string }) {
    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-slate-700/50 bg-slate-800/30 p-12">
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
