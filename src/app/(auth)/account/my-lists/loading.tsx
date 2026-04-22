import { Skeleton } from '@/components/ui/skeleton'

export default function MyListsLoading() {
    return (
        // <div className="mx-auto min-h-screen w-full max-w-7xl px-4 py-8">
        //     {/* Header */}
        //     <div className="mb-8 space-y-4">
        //         <div className="h-10 w-64 animate-pulse rounded-lg bg-gray-900"></div>
        //         <div className="h-6 w-96 animate-pulse rounded bg-gray-900"></div>
        //     </div>

        //     {/* Stats Cards */}
        //     <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        //         {[1, 2, 3, 4].map((i) => (
        //             <div
        //                 key={i}
        //                 className="rounded-lg border border-gray-900 bg-gray-800 p-6"
        //             >
        //                 <div className="mb-2 h-4 w-24 animate-pulse rounded bg-gray-900"></div>
        //                 <div className="h-8 w-16 animate-pulse rounded bg-gray-600"></div>
        //             </div>
        //         ))}
        //     </div>

        //     {/* Lists/Tabs Section */}
        //     <div className="space-y-6">
        //         {/* Tabs */}
        //         <div className="flex gap-2 border-b border-gray-900">
        //             {[1, 2, 3, 4].map((i) => (
        //                 <div
        //                     key={i}
        //                     className="h-10 w-32 animate-pulse rounded-t-lg bg-gray-900"
        //                 ></div>
        //             ))}
        //         </div>

        //         {/* List Items */}
        //         <div className="space-y-4">
        //             {[1, 2, 3, 4, 5].map((i) => (
        //                 <div
        //                     key={i}
        //                     className="flex gap-4 rounded-lg border border-gray-900 bg-gray-800 p-4"
        //                 >
        //                     {/* Image */}
        //                     <div className="h-32 w-24 shrink-0 animate-pulse rounded-lg bg-gray-900"></div>

        //                     {/* Content */}
        //                     <div className="flex-1 space-y-3">
        //                         <div className="h-6 w-3/4 animate-pulse rounded bg-gray-900"></div>
        //                         <div className="h-4 w-1/2 animate-pulse rounded bg-gray-900"></div>
        //                         <div className="h-4 w-2/3 animate-pulse rounded bg-gray-900"></div>
        //                     </div>

        //                     {/* Actions */}
        //                     <div className="flex flex-col gap-2">
        //                         <div className="h-8 w-8 animate-pulse rounded bg-gray-900"></div>
        //                         <div className="h-8 w-8 animate-pulse rounded bg-gray-900"></div>
        //                     </div>
        //                 </div>
        //             ))}
        //         </div>
        //     </div>
        // </div>

        <div className="mx-auto min-h-screen w-full max-w-7xl px-4 py-8">
            {/* Title skeleton */}
            <div className="mb-8">
                <Skeleton className="h-9 w-32 bg-gray-700 md:h-10 md:w-40" />
            </div>

            {/* Tabs skeleton */}
            <div className="w-full">
                {/* Tabs list skeleton */}
                <div className="mb-6 flex w-full flex-wrap justify-start gap-2">
                    <Skeleton className="h-10 w-28 rounded-lg bg-gray-700" />
                    <Skeleton className="h-10 w-36 rounded-lg bg-gray-700" />
                    <Skeleton className="h-10 w-32 rounded-lg bg-gray-700" />
                    <Skeleton className="h-10 w-24 rounded-lg bg-gray-700" />
                    <Skeleton className="h-10 w-28 rounded-lg bg-gray-700" />
                </div>

                {/* Tab content skeleton - Empty state */}
                <div className="mt-6">
                    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-slate-700/50 bg-slate-800/30 p-12">
                        <Skeleton className="mb-4 h-24 w-24 rounded-full bg-gray-800" />
                        <Skeleton className="h-7 w-32 bg-gray-700" />
                        <Skeleton className="mt-2 h-5 w-48 bg-gray-700" />
                    </div>
                </div>
            </div>
        </div>
    )
}
