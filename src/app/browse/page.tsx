export const dynamic = 'force-dynamic'
import { FetchBrowsersAnime } from '@/lib/api'
import { AnimeList } from '@/components/AnimeList/AnimeList'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { AnimeListSkeleton } from '@/components/ui/SkeletonCard/AnimeSkeletonList'
import { Pagination } from '@/components/Pagination/Pagination'
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
                <Pagination
                    current_Page={pagination.current_page}
                    has_next_page={pagination.has_next_page}
                    last_visible_page={pagination.last_visible_page}
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
            <Pagination
                current_Page={pagination.current_page}
                has_next_page={pagination.has_next_page}
                last_visible_page={pagination.last_visible_page}
            />
        </main>
    )
}
