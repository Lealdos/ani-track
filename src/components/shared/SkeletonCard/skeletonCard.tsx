export function SkeletonCard() {
    return (
        <article className="flex w-full max-w-[180px] animate-pulse flex-col overflow-hidden rounded-xl bg-card border border-border/50 md:max-w-[200px]">
            <div className="relative aspect-[2/3] w-full bg-secondary/50" />
            <div className="p-3 space-y-2">
                <div className="h-4 w-3/4 rounded bg-secondary/50" />
                <div className="h-3 w-1/2 rounded bg-secondary/50" />
            </div>
        </article>
    )
}
