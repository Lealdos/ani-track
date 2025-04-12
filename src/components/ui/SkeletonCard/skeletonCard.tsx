export function SkeletonCard() {
    return (
        <article className="flex animate-pulse flex-col items-center justify-between overflow-hidden rounded-lg border bg-white transition-all duration-400">
            <div className="w-full">
                <div className="relative w-full">
                    <div className="aspect-[2/3] w-full rounded bg-gray-200"></div>
                    <div className="absolute top-2 right-2 h-6 w-12 rounded-md bg-yellow-300/70"></div>
                </div>
                <section className="w-full p-3">
                    <div className="mb-2 h-4 w-3/4 rounded bg-gray-300"></div>
                    <div className="h-3 w-2/4 rounded bg-gray-200"></div>
                </section>
            </div>
            <div className="flex w-full justify-center pb-3">
                <div className="h-8 w-28 rounded-lg bg-gray-300"></div>
            </div>
        </article>
    )
}
