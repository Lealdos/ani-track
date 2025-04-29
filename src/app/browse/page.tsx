export const dynamic = 'force-dynamic'
import { getAllAnimes, searchAnime } from '@/lib/api'
import { AnimeList } from '@/components/AnimeList/anime-list'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { AnimeListSkeleton } from '@/components/ui/SkeletonCard/AnimeSkeletonList'
import { Pagination } from '@/components/Pagination/Pagination'
import { Anime } from '@/types/anime'
import { paginationProps } from '@/types/pageInfo'

interface searchParamsProps {
    q?: string
    page?: number
    limit?: number
    sfw?: boolean
}

export default async function BrowseAnime({
    searchParams,
}: {
    searchParams: Promise<searchParamsProps>
}) {
    const {
        data: anime,
        pagination,
    }: { data: Anime[]; pagination: paginationProps } = await getAllAnimes()
    if (!anime) {
        return notFound()
    }
    if (!anime) {
        return notFound()
    }
    if (searchParams) {
        const { q, page } = await searchParams
        if (q) {
            const fetchedAnimeData = await searchAnime(q, page)
            if (!fetchedAnimeData || !('animes' in fetchedAnimeData)) {
                return null
            }
            const { animes, pagination } = fetchedAnimeData
            return (
                <div className="container mx-auto min-h-screen w-full px-4 py-8 text-white">
                    <Suspense fallback={<AnimeListSkeleton />}>
                        <AnimeList animes={animes} showBadge />
                    </Suspense>
                    <Pagination
                        currentPage={pagination.current_page}
                        nextPage={pagination.has_next_page}
                        lastPage={pagination.last_visible_page}
                    />
                </div>
            )
        }
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
