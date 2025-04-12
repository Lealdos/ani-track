import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export function AnimeListSkeleton() {
    return (
        <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-4">
            {Array(8)
                .fill(0)
                .map((_, i) => (
                    <Card
                        key={i}
                        className="h-[417px] w-[180px] animate-pulse overflow-hidden"
                    >
                        <div className="flex flex-col items-center justify-center">
                            <div className="relative aspect-[2/3] w-full">
                                <Skeleton className="absolute inset-0" />
                            </div>
                            <CardContent className="w-full p-3">
                                <Skeleton className="mb-2 h-2 w-full" />
                                <Skeleton className="h-2 w-3/4" />
                                <Skeleton className="mt-2 h-2 w-2/3" />
                            </CardContent>
                        </div>
                        <div className="px-3 pb-3">
                            <Skeleton className="h-9 w-full rounded-lg" />
                        </div>
                    </Card>
                ))}
        </div>
    )
}
