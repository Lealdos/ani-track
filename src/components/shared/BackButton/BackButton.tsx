'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

export function BackButton() {
    const router = useRouter()
    const t = useTranslations('BackButton')
    return (
        <div className="absolute left-6 top-6">
            <button
                className="rounded-full border-gray-700 bg-black/50 p-2 md:p-2"
                aria-label={t('goBack')}
                onClick={() => router.back()}
            >
                <span className="sr-only">{t('goBack')}</span>
                <ArrowLeft className="h-6 w-6" />
            </button>
        </div>
    )
}
