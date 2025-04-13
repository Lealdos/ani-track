import { SkeletonCard } from '@/components/ui/SkeletonCard/skeletonCard'

interface AnimeListSkeletonProps {
    sectionName?: string
    skeletonItemCount?: number
}

export function AnimeListSkeleton({
    sectionName,
    skeletonItemCount = 12,
}: AnimeListSkeletonProps) {
    return (
        <section className="scrollbar-hide snap-x gap-4 overflow-x-auto px-4 pb-4 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5">
            {[...Array(skeletonItemCount)].map((_, i) => (
                <SkeletonCard key={`${sectionName}-${i}`} />
            ))}
        </section>
    )
}
