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
        <section className="scrollbar-hide flex snap-x gap-4 overflow-x-auto px-4 py-6 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(skeletonItemCount)].map((_, i) => (
                <div
                    key={`${sectionName}-${i}`}
                    className="w-[70%] shrink-0 snap-start sm:w-[50%] md:w-[280px]"
                >
                    <SkeletonCard />
                </div>
            ))}
        </section>
    )
}
