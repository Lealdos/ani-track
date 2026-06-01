import { SectionHeader } from '@/components/shared/SectionHeader/SectionHeader'

import GenresList from './components/GenresList'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { getTranslations, setRequestLocale } from 'next-intl/server'

export default async function Genres({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    setRequestLocale(locale)
    const t = await getTranslations('Genres')
    return (
        <div className="w-full py-12">
            <SectionHeader title={t('browseByGenre')} />
            <Suspense
                fallback={
                    <div className="container mx-auto grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                        {Array.from({ length: 32 }).map((_, i) => (
                            <Skeleton
                                key={`skeleton-genres-${i + 80}`}
                                className="h-16 rounded-lg bg-violet-900/60"
                            />
                        ))}
                    </div>
                }
            >
                <GenresList />
            </Suspense>
        </div>
    )
}
