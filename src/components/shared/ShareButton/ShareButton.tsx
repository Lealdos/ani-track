'use client'

import { Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

type ShareButtonProps = {
    title: string
    text?: string
    url?: string
    label?: string
} & VariantProps<typeof buttonVariants> &
    Omit<ComponentProps<'button'>, 'onClick'>

export function ShareButton({
    title,
    text,
    url,
    label,
    size = 'default',
    className,
    ...props
}: ShareButtonProps) {
    const t = useTranslations('Share')
    const resolvedLabel = label ?? t('share')
    const handleShare = async () => {
        const shareUrl = url ?? globalThis.location.href

        const shareData = {
            title,
            text,
            url: shareUrl,
        }

        try {
            if (navigator.share && navigator.canShare?.(shareData)) {
                await navigator.share(shareData)
                return
            }

            await navigator.clipboard.writeText(shareUrl)
            toast.success(t('linkCopied'))
        } catch (error) {
            console.error('Share failed:', error)
            toast.error(t('notSupported'))
        }
    }

    return (
        <Button
            type="button"
            size={size}
            onClick={handleShare}
            className={cn(
                'bg-violet-900 text-base text-white hover:bg-violet-800 dark:bg-violet-900 dark:hover:bg-violet-800',
                className
            )}
            aria-label={resolvedLabel}
            {...props}
        >
            <Share2 className="h-4 w-4" />
            {size !== 'icon' && size !== 'icon-sm' && size !== 'icon-lg' && (
                <span>{resolvedLabel}</span>
            )}
        </Button>
    )
}
