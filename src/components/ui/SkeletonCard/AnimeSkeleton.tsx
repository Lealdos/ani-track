import { SkeletonCard } from '@/components/ui/SkeletonCard/skeletonCard'

export function AnimeListSkeleton() {
    return (
        <section className="flex flex-row gap-4 px-4 py-6 sm:grid-cols-3 md:grid md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </section>
    )
}
