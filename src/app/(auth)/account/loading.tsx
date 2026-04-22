import { Skeleton } from '@/components/ui/skeleton'

export default function AccountLoading() {
    return (
        <div className="mx-auto my-6 min-h-screen max-w-2xl rounded-lg bg-gray-800 px-4 py-12 sm:px-6 md:min-w-lg lg:px-8">
            {/* Title skeleton */}
            <Skeleton className="mx-auto mb-8 h-10 w-48 bg-gray-900" />

            <div className="w-full">
                {/* Tabs skeleton */}
                <div className="grid w-full grid-cols-2 rounded-t-lg border-b border-gray-900 bg-linear-to-r from-slate-900 via-gray-800 to-slate-900">
                    <Skeleton className="m-1 h-12 rounded bg-gray-900" />
                    <Skeleton className="m-1 h-12 rounded bg-gray-900" />
                </div>

                {/* Form content skeleton */}
                <div className="mt-8 space-y-6">
                    {/* Avatar/Image skeleton */}
                    <div className="flex flex-col items-center gap-4">
                        <Skeleton className="h-32 w-32 rounded-full bg-gray-900" />
                        <Skeleton className="h-10 w-40 bg-gray-900" />
                    </div>

                    {/* Form fields skeleton */}
                    <div className="space-y-6">
                        {/* Name field */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20 bg-gray-900" />
                            <Skeleton className="h-10 w-full bg-gray-900" />
                            <Skeleton className="h-3 w-64 bg-gray-900" />
                        </div>

                        {/* Username field */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24 bg-gray-900" />
                            <Skeleton className="h-10 w-full bg-gray-900" />
                            <Skeleton className="h-3 w-72 bg-gray-900" />
                        </div>

                        {/* Email field */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-16 bg-gray-900" />
                            <Skeleton className="h-10 w-full bg-gray-900" />
                            <Skeleton className="h-3 w-80 bg-gray-900" />
                        </div>

                        {/* Submit button skeleton */}
                        <Skeleton className="h-10 w-full bg-gray-800" />
                    </div>
                </div>
            </div>
        </div>
    )
}
