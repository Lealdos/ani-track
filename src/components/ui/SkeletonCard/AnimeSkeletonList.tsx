import { SkeletonCard } from '@/components/ui/SkeletonCard/skeletonCard'

interface AnimeListSkeletonProps {
    sectionName: string
}

export function AnimeListSkeleton({ sectionName }: AnimeListSkeletonProps) {
    return (
        <>
            <section className="scrollbar-hide hidden snap-x gap-4 overflow-x-auto px-4 pb-4 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5">
                {[...Array(12)].map((_, i) => (
                    <SkeletonCard key={`${sectionName}-${i}`} />
                ))}
            </section>

            <section className="flex snap-x gap-4 overflow-x-auto px-4 pb-4 md:hidden">
                <div className="flex shrink-0 flex-row gap-4">
                    {[...Array(12)].map((_, i) => (
                        <SkeletonCard key={`${sectionName}-${i}`} />
                    ))}
                </div>
            </section>
        </>
    )
}
