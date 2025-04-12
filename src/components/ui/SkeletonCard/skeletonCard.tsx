export function SkeletonCard() {
    return (
        <article className="flex animate-pulse flex-col items-center justify-between overflow-hidden rounded-lg border bg-white">
            <div className="relative aspect-[2/3] w-full rounded bg-muted" />
            <section className="w-full p-3">
                <div className="mb-2 h-4 w-3/4 rounded bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted" />
            </section>
            <div className="w-full px-3 pb-3">
                <div className="h-8 w-full rounded-lg bg-muted" />
            </div>
        </article>
    )
}
