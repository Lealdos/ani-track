export function SkeletonCard() {
    return (
        <article className="h-80  md:h-full max-w-[200px] md:max-w-[320px] flex animate-pulse flex-col items-center justify-between overflow-hidden rounded-lg border bg-slate-800 max-h-[420px]">
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
