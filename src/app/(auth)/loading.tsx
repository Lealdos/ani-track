import { Skeleton } from '@/components/ui/skeleton'

export default function AuthLoading() {
    return (
        <div className="mx-auto my-6 max-w-xl min-w-md rounded-lg bg-gray-800 px-4 py-12 sm:px-6 lg:px-8">
            {/* Title skeleton */}
            <Skeleton className="mx-auto mb-8 h-10 w-48 bg-gray-900" />

            <div className="w-full">
                {/* Form content skeleton */}
                <div className="mt-8 space-y-6">
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
