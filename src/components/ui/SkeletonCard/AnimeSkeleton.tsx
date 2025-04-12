import { SkeletonCard } from '@/components/ui/SkeletonCard/skeletonCard'

interface AnimeListSkeletonProps {
    sectionName: string
}

export function AnimeListSkeleton({ sectionName }: AnimeListSkeletonProps) {
    return (
        <section className="scrollbar-hide flex flex-row justify-between justify-items-stretch gap-4 overflow-x-auto rounded-md border-b-2 border-b-background/10 p-4 px-4 py-6 pb-4 sm:grid-cols-3 md:grid md:grid-cols-3 md:flex-wrap md:gap-8 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5">
            {[...Array(12)].map((_, i) => (
                <SkeletonCard key={`${sectionName}-${i}`} />
            ))}
        </section>
    )
}
