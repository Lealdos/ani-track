'use client'
import { Tv, Clock, CheckCircle2, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useWatchStatus, WatchStatus } from '@/hooks/useWatchStatus'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import { ListsAnimes } from '@/types/anime'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const STATUS_OPTIONS: { value: WatchStatus; label: string; Icon: typeof Tv }[] =
    [
        { value: 'watching', label: 'Watching', Icon: Tv },
        { value: 'plan_to_watch', label: 'Plan to Watch', Icon: Clock },
        { value: 'completed', label: 'Completed', Icon: CheckCircle2 },
    ]

interface Props {
    anime: ListsAnimes
}

export function WatchStatusButton({ anime }: Props) {
    const { getStatus, setStatus, clearStatus } = useWatchStatus()
    const { requireAuth } = useRequireAuth()
    const current = getStatus(anime.mal_id)

    const currentLabel =
        STATUS_OPTIONS.find((statusOption) => statusOption.value === current)
            ?.label ?? 'Set status'

    const handleSet = (s: WatchStatus) => {
        requireAuth(() => {
            setStatus(anime, s)
            toast.success(
                `Marked as ${STATUS_OPTIONS.find((o) => o.value === s)?.label}`
            )
        })
    }

    return (
        <div className="flex flex-wrap gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant={current ? 'default' : 'secondary'}
                        size="sm"
                        className={`bg-violet-900 text-base ${current ? 'bg-violet-600' : ''}`}
                    >
                        {current ? (
                            <Check className="mr-2 h-4 w-4" />
                        ) : (
                            <Tv className="mr-2 h-4 w-4" />
                        )}
                        {currentLabel}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuLabel className="text-md font-medium md:text-base">
                        Watch status
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {STATUS_OPTIONS.map((statusOption) => (
                        <DropdownMenuItem
                            key={statusOption.value}
                            onClick={() => handleSet(statusOption.value)}
                            className={cn(
                                `text-base ${current === statusOption.value && 'text-primary'}`
                            )}
                        >
                            <statusOption.Icon className="mr-2 h-4 w-4" />
                            {statusOption.label}
                            {current === statusOption.value && (
                                <Check className="ml-auto h-4 w-4" />
                            )}
                        </DropdownMenuItem>
                    ))}
                    {current && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => {
                                    requireAuth(() => {
                                        clearStatus(anime.mal_id)
                                        toast.success('Status removed')
                                    })
                                }}
                                className="text-base text-destructive focus:text-destructive"
                            >
                                <X className="mr-2 h-4 w-4" /> Remove status
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
