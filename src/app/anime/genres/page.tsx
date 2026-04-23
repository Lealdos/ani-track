import { SectionHeader } from '@/components/shared/SectionHeader/SectionHeader'

import GenresList from './components/GenresList'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function Genres() {
    return (
        <div className="container py-12">
            <SectionHeader title={'Browse by Genre'} />
            <Suspense
                fallback={
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
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
