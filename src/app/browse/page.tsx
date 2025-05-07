export const dynamic = 'force-dynamic'
import { FetchBrowsersAnime } from '@/lib/api'
import { AnimeList } from '@/components/AnimeList/AnimeList'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { AnimeListSkeleton } from '@/components/ui/SkeletonCard/AnimeSkeletonList'
import { NumberedPagination } from '@/components/Pagination/NumberedPagination'
import { FilterAndStringifySearchParams } from '@/lib/utils'
import { searchParamsProps } from '@/types/SearchParamsProps'

export default async function BrowseAnime({
    searchParams,
}: {
    searchParams: Promise<searchParamsProps>
}) {
    const rawParams = await searchParams
    const { q, page } = rawParams
    const stringSearchParams = FilterAndStringifySearchParams(rawParams)

    const animeSearchParamsString = new URLSearchParams(
        stringSearchParams
    ).toString()

    if (!q && !page) {
        const { animes, pagination } = await FetchBrowsersAnime()
        if (!animes) {
            return notFound()
        }
        return (
            <main className="container mx-auto min-h-screen w-full px-4 py-8 text-white">
                <Suspense fallback={<AnimeListSkeleton />}>
                    <AnimeList animes={animes} showBadge />
                </Suspense>
                <NumberedPagination
                    currentPage={pagination.current_page}
                    lastPage={pagination.last_visible_page ?? 1}
                    hasNextPage={pagination.has_next_page}
                />
            </main>
        )
    }

    // If q or page is present, fetch with params
    const { animes, pagination } = await FetchBrowsersAnime(
        animeSearchParamsString,
        page
    )
    if (!animes) {
        return notFound()
    }

    return (
        <main className="mx-auto min-h-screen w-full px-4 py-8">
            {(q || page) && (
                <Suspense fallback={<AnimeListSkeleton />}>
                    <AnimeList animes={animes} showBadge />
                </Suspense>
            )}
            <NumberedPagination
                currentPage={pagination.current_page}
                lastPage={pagination.last_visible_page ?? 1}
                hasNextPage={pagination.has_next_page}
            />
        </main>
    )
}
