import { mergeClassNames } from '@/lib/utils/utils'

function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={mergeClassNames(
                'bg-muted animate-pulse rounded-md',
                className
            )}
            {...props}
        />
    )
}

export { Skeleton }
