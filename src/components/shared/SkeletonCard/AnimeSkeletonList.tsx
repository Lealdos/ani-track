import { SkeletonCard } from '@/components/shared/SkeletonCard/skeletonCard'

interface AnimeListSkeletonProps {
    sectionName?: string
    skeletonItemCount?: number
}

export function AnimeListSkeleton({
    sectionName,
    skeletonItemCount = 10,
}: AnimeListSkeletonProps) {
    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {[...Array(skeletonItemCount)].map((_, i) => (
                <SkeletonCard key={`${sectionName}-skeleton-${i}`} />
            ))}
        </div>
    )
}
