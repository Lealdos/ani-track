export function SkeletonCard() {
    return (
        <article className="flex h-80 max-h-[360px] w-full max-w-[200px] animate-pulse flex-col items-center justify-between overflow-hidden rounded-lg bg-slate-800 md:h-full md:max-w-[200px]">
            <div className="bg-muted relative aspect-[1/3] w-full rounded" />
            <section className="w-full p-3">
                <div className="bg-muted mb-2 h-4 w-3/4 rounded" />
                <div className="bg-muted h-3 w-1/2 rounded" />
            </section>
            <div className="w-full px-3 pb-3">
                <div className="bg-muted h-8 w-full rounded-lg" />
            </div>
        </article>
    )
}
