import { SkeletonCard } from '@/components/shared/SkeletonCard/skeletonCard'

interface AnimeListSkeletonProps {
    sectionName?: string
    skeletonItemCount?: number
    gridClassName?: string
}

const DEFAULT_GRID =
    'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'

export function AnimeListSkeleton({
    sectionName,
    skeletonItemCount = 12,
    gridClassName = DEFAULT_GRID,
}: AnimeListSkeletonProps) {
    return (
        <section className={gridClassName}>
            {Array.from({ length: skeletonItemCount }).map((_, i) => (
                <SkeletonCard key={`${sectionName}-${i}`} />
            ))}
        </section>
    )
}
