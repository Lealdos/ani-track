import { getAllAnimes } from '@/lib/api'
import { AnimeList } from '@/components/anime-list'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { AnimeListSkeleton } from '@/components/ui/SkeletonCard/AnimeSkeletonList'
import { Pagination } from '@/components/Pagination/Pagination'
import { Anime } from '@/types/anime'

import { paginationProps } from '@/types/pageInfo'

export default async function BrowseAnime() {
    const {
        data: anime,
        pagination,
    }: { data: Anime[]; pagination: paginationProps } = await getAllAnimes()
    if (!anime) {
        return notFound()
    }

    return (
        <div className="container mx-auto min-h-screen w-full px-4 py-8 text-white">
            <Suspense fallback={<AnimeListSkeleton />}>
                <AnimeList animes={anime} showBadge />
            </Suspense>
            <Pagination
                currentPage={pagination.current_page}
                nextPage={pagination.has_next_page}
                lastPage={pagination.last_visible_page}
            />
        </div>
    )
}
