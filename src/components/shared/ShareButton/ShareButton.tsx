'use client'

import { Share2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

type ShareButtonProps = {
    title: string
    text?: string
    url?: string
    label?: string
    className?: string
} & VariantProps<typeof buttonVariants> &
    Omit<ComponentProps<'button'>, 'onClick'>

export function ShareButton({
    title,
    text,
    url,
    label = 'Share',
    variant = 'outline',
    size = 'default',
    className,
    ...props
}: ShareButtonProps) {
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
            toast.success('Link copied to clipboard')
        } catch (error) {
            console.error('Share failed:', error)
            toast.error('Sharing is not supported on this device')
        }
    }

    return (
        <Button
            type="button"
            variant={variant}
            size={size}
            onClick={handleShare}
            className={cn(className)}
            aria-label={label}
            {...props}
        >
            <Share2 className="h-4 w-4" />
            {size !== 'icon' && size !== 'icon-sm' && size !== 'icon-lg' && (
                <span>{label}</span>
            )}
        </Button>
    )
}
