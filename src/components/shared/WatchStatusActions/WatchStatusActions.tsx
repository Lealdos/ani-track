'use client'
import { Tv, Clock, CheckCircle2, X, Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
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
import type { ListsAnimes } from '@/entities/anime/models'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const STATUS_OPTIONS: {
    value: WatchStatus
    labelKey: 'watching' | 'planToWatch' | 'completed'
    Icon: typeof Tv
}[] = [
    { value: 'watching', labelKey: 'watching', Icon: Tv },
    { value: 'plan_to_watch', labelKey: 'planToWatch', Icon: Clock },
    { value: 'completed', labelKey: 'completed', Icon: CheckCircle2 },
]

interface Props {
    anime: ListsAnimes
}

export function WatchStatusButton({ anime }: Props) {
    const t = useTranslations('WatchStatus')
    const { getStatus, setStatus, clearStatus } = useWatchStatus()
    const { requireAuth } = useRequireAuth()
    const current = getStatus(anime.id)

    const currentOption = STATUS_OPTIONS.find(
        (statusOption) => statusOption.value === current
    )
    const currentLabel = currentOption
        ? t(currentOption.labelKey)
        : t('setStatus')

    const handleSet = (s: WatchStatus) => {
        requireAuth(() => {
            setStatus(anime, s)
            const option = STATUS_OPTIONS.find((o) => o.value === s)
            toast.success(
                t('markedAs', { status: option ? t(option.labelKey) : '' })
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
                        {t('watchStatus')}
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
                            {t(statusOption.labelKey)}
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
                                        clearStatus(anime.id)
                                        toast.success(t('statusRemoved'))
                                    })
                                }}
                                className="text-destructive focus:text-destructive text-base"
                            >
                                <X className="mr-2 h-4 w-4" />{' '}
                                {t('removeStatus')}
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
