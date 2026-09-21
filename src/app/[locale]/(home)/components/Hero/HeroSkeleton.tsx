import { Skeleton } from '@/components/ui/skeleton'

// Every box here mirrors the real <Hero> so the swap-in costs no layout shift.
// Bar heights are the line boxes of the text they stand in for, not round
// numbers — see the comments at each one.
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
                <div className="bg-gradient-glow absolute inset-0 opacity-80" />

                <div className="container relative flex min-h-[40vh] flex-col items-start justify-end pb-16 pt-24 md:pb-24">
                    {/* <SectionHeader> wraps its h2 in `mx-6 mb-6`; the h2 line
                        box is 36px at text-3xl and 40px at md:text-4xl. */}
                    <div className="mx-6 mb-6">
                        <Skeleton className="h-9 w-64 md:h-10" />
                    </div>
                    {/* The h1 is `mt-3 text-5xl leading-[1.05] md:text-7xl`, so
                        a line box is 50.4px / 75.6px. Measured, the tagline
                        wraps to 3 lines below md and 2 from md up — both
                        totalling 151.2px, which these bars plus gap-2 match. */}
                    <div className="mt-3 flex w-full max-w-3xl flex-col gap-2">
                        <Skeleton className="h-[45px] w-11/12 md:h-[71.6px]" />
                        <Skeleton className="h-[45px] w-8/12 md:h-[71.6px]" />
                        <Skeleton className="h-[45px] w-9/12 md:hidden" />
                    </div>
                </div>

                <div className="container flex flex-col items-stretch justify-between gap-4 md:mt-40 md:flex-row md:justify-start">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={`hero-nav-skeleton-${i + 9}`}
                            className="shadow-soft border-border/70 bg-card relative w-full overflow-hidden rounded-xl border p-5 backdrop-blur md:w-auto md:flex-1 md:basis-0 lg:min-w-80"
                        >
                            {/* icon h-5, then the title's 32px line box at
                                text-2xl, then the desc at text-sm (20px per
                                line). The desc measures one line while the card
                                is wide (below md, and again at xl) and two in
                                between, where the 3-up row squeezes it. */}
                            <Skeleton className="h-5 w-5 rounded" />
                            <Skeleton className="mt-3 h-8 w-40" />
                            <Skeleton className="mt-1 h-5 w-56" />
                            <Skeleton className="mt-1 hidden h-5 w-32 md:block xl:hidden" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
