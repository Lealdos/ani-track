'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useTransition } from 'react'
import { Globe } from 'lucide-react'

import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { cn } from '@/lib/utils'

export function LocaleSwitcher({ className }: { className?: string }) {
    const t = useTranslations('LocaleSwitcher')
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()
    const params = useParams()
    const [isPending, startTransition] = useTransition()

    function onSelect(nextLocale: (typeof routing.locales)[number]) {
        if (nextLocale === locale) return
        startTransition(() => {
            // @ts-expect-error -- params are compatible with the current route
            router.replace({ pathname, params }, { locale: nextLocale })
        })
    }

    return (
        <div
            className={cn('flex items-center gap-1', className)}
            aria-label={t('label')}
        >
            <Globe className="h-4 w-4 text-gray-300" aria-hidden="true" />
            {routing.locales.map((cur) => (
                <button
                    key={cur}
                    type="button"
                    onClick={() => onSelect(cur)}
                    disabled={isPending}
                    aria-current={cur === locale ? 'true' : undefined}
                    className={cn(
                        'rounded px-1.5 py-0.5 text-xs font-semibold uppercase transition-colors disabled:opacity-50',
                        cur === locale
                            ? 'bg-red-700 text-white'
                            : 'text-gray-300 hover:text-white'
                    )}
                >
                    {cur}
                </button>
            ))}
        </div>
    )
}
