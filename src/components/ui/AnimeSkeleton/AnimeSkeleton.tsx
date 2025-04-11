import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export function AnimeListSkeleton() {
    return (
        <div className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide'>
            {Array(8)
                .fill(0)
                .map((_, i) => (
                    <Card
                        key={i}
                        className='overflow-hidden h-[417px] w-[180px] animate-pulse'
                    >
                        <div className='flex flex-col justify-center items-center'>
                            <div className='relative aspect-[2/3] w-full'>
                                <Skeleton className='absolute inset-0' />
                            </div>
                            <CardContent className='p-3 w-full'>
                                <Skeleton className='h-2 w-full mb-2' />
                                <Skeleton className='h-2 w-3/4' />
                                <Skeleton className='h-2 w-2/3 mt-2' />
                            </CardContent>
                        </div>
                        <div className='px-3 pb-3'>
                            <Skeleton className='h-9 w-full rounded-lg' />
                        </div>
                    </Card>
                ))}
        </div>
    );
}
