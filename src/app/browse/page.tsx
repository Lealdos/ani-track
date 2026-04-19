import { FetchBrowsersAnime } from '@/services/JikanAPI/jikanAnimeApi'
import { AnimeList } from '@/components/shared/AnimeList/AnimeList'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { AnimeListSkeleton } from '@/components/shared/SkeletonCard/AnimeSkeletonList'
import { NumberedPagination } from '@/components/shared/Pagination/NumberedPagination'
import { FilterAndStringifySearchParams } from '@/lib/utils'
import { searchParamsProps } from '@/types/SearchParamsProps'
import Link from 'next/link'
import { FavoriteProvider } from '@/context/favoriteContext'
import { Search, ArrowLeft } from 'lucide-react'

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

    // If no q or page is present, fetch without params
    if (!q && !page) {
        const { animes, pagination } = await FetchBrowsersAnime()
        if (animes.length === 0) {
            return notFound()
        }
        return (
            <FavoriteProvider>
                <main className="container mx-auto max-w-7xl min-h-screen w-full px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                            Browse Anime
                        </h1>
                        <p className="text-muted-foreground">
                            Discover and explore anime from our collection
                        </p>
                    </div>
                    <Suspense fallback={<AnimeListSkeleton />}>
                        <AnimeList animes={animes} showBadge />
                    </Suspense>
                    <div className="mt-8">
                        <NumberedPagination
                            currentPage={pagination.current_page}
                            lastPage={pagination.last_visible_page ?? 1}
                            hasNextPage={pagination.has_next_page}
                        />
                    </div>
                </main>
            </FavoriteProvider>
        )
    }

    // If q or page is present, fetch with params
    const { animes, pagination } = await FetchBrowsersAnime(
        animeSearchParamsString,
        page
    )
    
    if (animes.length === 0) {
        return (
            <main className="container mx-auto max-w-7xl flex min-h-screen w-full flex-col items-center justify-center px-4 py-12">
                <div className="rounded-2xl bg-card border border-border/50 p-8 text-center max-w-md">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                        <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h1 className="mb-2 text-xl font-bold text-foreground">
                        No results found
                    </h1>
                    <p className="mb-6 text-muted-foreground">
                        We couldn&apos;t find any anime matching &quot;{q}&quot;
                    </p>
                    <Link
                        href="/browse"
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Browse
                    </Link>
                </div>
                <div className="mt-8">
                    <NumberedPagination
                        currentPage={pagination.current_page}
                        lastPage={pagination.last_visible_page ?? 1}
                        hasNextPage={pagination.has_next_page}
                    />
                </div>
            </main>
        )
    }

    return (
        <FavoriteProvider>
            <main className="container mx-auto max-w-7xl min-h-screen w-full px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                        {q ? `Search results for "${q}"` : 'Browse Anime'}
                    </h1>
                    <p className="text-muted-foreground">
                        {q ? `Found ${animes.length} anime matching your search` : 'Discover and explore anime from our collection'}
                    </p>
                </div>
                <Suspense fallback={<AnimeListSkeleton />}>
                    <AnimeList animes={animes} showBadge />
                </Suspense>
                <div className="mt-8">
                    <NumberedPagination
                        currentPage={pagination.current_page}
                        lastPage={pagination.last_visible_page ?? 1}
                        hasNextPage={pagination.has_next_page}
                    />
                </div>
            </main>
        </FavoriteProvider>
    )
}
