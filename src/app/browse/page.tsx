export const dynamic = 'force-dynamic'
import { getAllAnimes } from '@/lib/api'
import { AnimeList } from '@/components/AnimeList/anime-list'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { AnimeListSkeleton } from '@/components/ui/SkeletonCard/AnimeSkeletonList'
import { Pagination } from '@/components/Pagination/Pagination'
import { SearchResults } from './Components/search-results'

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
    const { animes, pagination } = await getAllAnimes()
    if (!animes) {
        return notFound()
    }

    if (searchParams) {
        const { q, page } = await searchParams
        if (q || page) {
            return (
                <main className="mx-auto min-h-screen w-full px-4 py-8">
                    {(q || page) && (
                        <Suspense fallback={<AnimeListSkeleton />}>
                            <SearchResults
                                query={q ? q : ''}
                                page={page ? page : 1}
                            />
                        </Suspense>
                    )}
                </main>
            )
        }
    }

    return (
        <main className="container mx-auto min-h-screen w-full px-4 py-8 text-white">
            <Suspense fallback={<AnimeListSkeleton />}>
                <AnimeList animes={animes} showBadge />
            </Suspense>
            <Pagination
                currentPage={pagination.current_page}
                nextPage={pagination.has_next_page}
                lastPage={pagination.last_visible_page}
            />
        </main>
    )
}
