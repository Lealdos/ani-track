import { Skeleton } from '@/components/ui/skeleton'

export function HeroSkeleton() {
    return (
        <section
            className="f-full relative -top-10 w-full"
            aria-busy="true"
            aria-live="polite"
        >
            <div className="relative flex h-screen w-full flex-col items-center justify-evenly overflow-hidden rounded-lg p-4">
                <Skeleton className="absolute inset-0 h-full w-full rounded-none opacity-30" />
                <div className="bg-linear-to-b from-background/10 via-background/50 to-background absolute inset-0" />

                <div className="container relative flex min-h-[40vh] flex-col items-start justify-end pb-16 pt-24 md:pb-24">
                    <Skeleton className="h-5 w-48" />
                    <div className="mt-4 flex w-full max-w-3xl flex-col gap-3">
                        <Skeleton className="h-12 w-11/12 md:h-16" />
                        <Skeleton className="h-12 w-8/12 md:h-16" />
                        <Skeleton className="h-12 w-9/12 md:h-16" />
                    </div>
                </div>

                <div className="items-center-safe container flex flex-col flex-wrap justify-between gap-4 md:mt-40 md:flex-row md:justify-start">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={`hero-nav-skeleton-${i + 9}`}
                            className="shadow-soft border-border/70 bg-card relative min-w-80 overflow-hidden rounded-xl border p-5 backdrop-blur"
                        >
                            <Skeleton className="h-5 w-5 rounded" />
                            <Skeleton className="mt-3 h-7 w-40" />
                            <Skeleton className="mt-2 h-4 w-56" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
