import { animeRepository } from '@/entities/anime/api'
import { AnimeList } from '@/components/shared/AnimeList/AnimeList'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { AnimeListSkeleton } from '@/components/shared/SkeletonCard/AnimeSkeletonList'
import { NumberedPagination } from '@/components/shared/Pagination/NumberedPagination'
import { FilterAndStringifySearchParams } from '@/lib/utils'
import { searchParamsProps } from '@/types/SearchParamsProps'
import { Link } from '@/i18n/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { FavoriteProvider } from '@/context/favoriteContext'
import { SectionHeader } from '@/components/shared/SectionHeader/SectionHeader'

export default async function BrowseAnime({
    params,
    searchParams,
}: {
    params: Promise<{ locale: string }>
    searchParams: Promise<searchParamsProps>
}) {
    const { locale } = await params
    setRequestLocale(locale)
    const t = await getTranslations('Browse')
    const rawParams = await searchParams
    const { q } = rawParams
    const stringSearchParams = FilterAndStringifySearchParams(rawParams)

    const animeSearchParamsString = new URLSearchParams(
        stringSearchParams
    ).toString()

    // If no params at all, fetch without filters
    if (!animeSearchParamsString) {
        const { animes, pagination } = await animeRepository.browse()
        if (animes.length === 0) {
            return notFound()
        }
        return (
            <FavoriteProvider>
                <main className="container mx-auto w-full px-4 py-8 text-white">
                    <SectionHeader title={t('title')} />

                    <Suspense fallback={<AnimeListSkeleton />}>
                        <AnimeList animes={animes} showBadge />
                    </Suspense>
                    <NumberedPagination
                        currentPage={pagination.current_page}
                        lastPage={pagination.last_visible_page ?? 1}
                        hasNextPage={pagination.has_next_page}
                    />
                </main>
            </FavoriteProvider>
        )
    }

    // If q or page is present, fetch with params
    const { animes, pagination } = await animeRepository.browse(
        animeSearchParamsString
    )
    if (animes.length === 0) {
        return (
            <main className="container mx-auto flex h-screen w-full flex-col items-center justify-between px-8 py-6">
                <div className="my-auto flex flex-col gap-6 text-center">
                    <h1 className="mt-8 text-2xl font-bold text-white">
                        {t('noResults', { query: q ?? '' })}
                    </h1>
                    <Link href="/browse">
                        <button className="ml-4 rounded-md bg-red-800 px-4 py-2 text-white">
                            {t('title')}
                        </button>
                    </Link>
                </div>
                <NumberedPagination
                    currentPage={pagination.current_page}
                    lastPage={pagination.last_visible_page ?? 1}
                    hasNextPage={pagination.has_next_page}
                />
            </main>
        )
    }

    return (
        <FavoriteProvider>
            <main className="mx-auto w-full px-4 py-8">
                <Suspense fallback={<AnimeListSkeleton />}>
                    <AnimeList animes={animes} showBadge />
                </Suspense>
                <NumberedPagination
                    currentPage={pagination.current_page}
                    lastPage={pagination.last_visible_page ?? 1}
                    hasNextPage={pagination.has_next_page}
                />
            </main>
        </FavoriteProvider>
    )
}
