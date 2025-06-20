import { SkeletonCard } from '@/components/SkeletonCard/skeletonCard'

interface AnimeListSkeletonProps {
    sectionName?: string
    skeletonItemCount?: number
}

export function AnimeListSkeleton({
    sectionName,
    skeletonItemCount = 12,
}: AnimeListSkeletonProps) {
    return (
        <section className="scrollbar-hide grid snap-x grid-cols-2 justify-items-center gap-4 overflow-x-auto px-4 py-6 sm:grid-cols-3 md:gap-4 md:overflow-visible lg:grid-cols-4 xl:grid-cols-5">
            {[...Array(skeletonItemCount)].map((_, i) => (
                <SkeletonCard key={`${sectionName}-${i}`} />
            ))}
        </section>
    )
}
