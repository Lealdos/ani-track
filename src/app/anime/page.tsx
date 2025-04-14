import { getAllAnimes } from '@/lib/api'
import { AnimeList } from '@/components/anime-list'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { AnimeListSkeleton } from '@/components/ui/SkeletonCard/AnimeSkeletonList'

export default async function BrowseAnime() {
    const { data: anime, pagination } = await getAllAnimes(2)
    if (!anime) {
        return notFound()
    }
    return (
        <div className="container mx-auto min-h-screen w-full px-4 py-8 text-white">
            <Suspense fallback={<AnimeListSkeleton />}>
                <AnimeList animes={anime} showBadge />
            </Suspense>
            <div className="mt-4 flex flex-row items-center justify-between">
                <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    {pagination.current_page > 1 ? '←' : ''} Previous page
                </button>
                {pagination.current_page}
                <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    Next page {pagination.has_next_page ? '→' : ''}
                </button>
            </div>
        </div>
    )
}
