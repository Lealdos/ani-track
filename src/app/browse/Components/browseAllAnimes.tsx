import { AnimeList } from '@/components/AnimeList/anime-list'
import { Pagination } from '@/components/Pagination/Pagination'
import { AnimeListSkeleton } from '@/components/ui/SkeletonCard/AnimeSkeletonList'
import { getAllAnimes } from '@/lib/api'
import { Suspense } from 'react'

export async function BrowseAllAnimes() {
    try {
        const result = await getAllAnimes()
        if (!result?.data) {
            throw new Error('Failed to fetch anime data')
        }

        return (
            <main className="mx-auto min-h-screen w-full px-4 py-8">
                <div className="container mx-auto min-h-screen w-full px-4 py-8 text-white">
                    <Suspense fallback={<AnimeListSkeleton />}>
                        <AnimeList animes={result.data} showBadge />
                    </Suspense>
                    <Pagination
                        currentPage={result.pagination.current_page}
                        hasNextPage={result.pagination.has_next_page}
                        lastPage={result.pagination.last_visible_page}
                    />
                </div>
            </main>
        )
    } catch {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4 text-center">
                <h2 className="text-xl font-semibold">
                    Failed to load anime list
                </h2>
                <p className="text-sm text-gray-500">Please try again later</p>
            </div>
        )
    }
}
