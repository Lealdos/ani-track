import { SkeletonCard } from '@/components/ui/SkeletonCard/skeletonCard'

interface AnimeListSkeletonProps {
    sectionName?: string
    items?: number
}

export function AnimeListSkeleton({
    sectionName,
    items = 12,
}: AnimeListSkeletonProps) {
    return (
        <>
            <section className="scrollbar-hide hidden snap-x gap-4 overflow-x-auto px-4 pb-4 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5">
                {[...Array(items)].map((_, i) => (
                    <SkeletonCard key={`${sectionName}-${i}`} />
                ))}
            </section>
            {/* mobile */}
            <section className="flex snap-x gap-4 overflow-x-auto bg-red-500 px-4 pb-4 md:hidden">
                <div className="flex w-full snap-start gap-4">
                    {[...Array(6)].map((_, i) => (
                        <SkeletonCard key={`${sectionName}-${i}`} />
                    ))}
                </div>
            </section>
        </>
    )
}
