'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function BrowseError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const t = useTranslations('ErrorState')

    useEffect(() => {
        console.error('Error browsing anime:', error)
    }, [error])

    return (
        <main className="container mx-auto flex min-h-[60vh] w-full flex-col items-center justify-center gap-6 px-8 py-6 text-center">
            <h1 className="text-3xl font-bold text-white">{t('title')}</h1>
            <p className="max-w-md text-lg text-gray-300">
                {t('upstreamDescription')}
            </p>
            <div className="flex gap-4">
                <button
                    onClick={reset}
                    className="rounded-md bg-red-800 px-4 py-2 text-white transition-colors hover:bg-red-700"
                >
                    {t('retry')}
                </button>
                <Link
                    href="/"
                    className="rounded-md border border-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-800"
                >
                    {t('goHome')}
                </Link>
            </div>
        </main>
    )
}
