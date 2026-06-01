'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

import { useRouter } from '@/i18n/navigation'

import { Search } from 'lucide-react'

export function SearchBar() {
    const t = useTranslations('SearchBar')
    const [query, setQuery] = useState('')
    const { push } = useRouter()

    const handleSearch = (searchEvent: React.FormEvent) => {
        searchEvent.preventDefault()
        if (!query) {
            return push('/browse')
        }
        const cleanQuery = query.trim()
        push(`/browse?q=${encodeURIComponent(cleanQuery).trim()}`)
        setQuery('')
    }

    return (
        <form onSubmit={handleSearch} className="w-full">
            <div className="relative flex w-full items-center justify-center">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-200" />
                <input
                    type="search"
                    placeholder={t('placeholder')}
                    className="h-10 w-full rounded-lg border border-b-red-500 border-l-red-500 border-r-red-700 border-t-red-700 bg-black/40 p-2 pl-10 pr-10 text-sm text-white placeholder:text-gray-400"
                    value={query}
                    onChange={(searchEvent: {
                        target: { value: React.SetStateAction<string> }
                    }) => setQuery(searchEvent.target.value)}
                    suppressHydrationWarning
                />
                <button
                    type="submit"
                    className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-md px-2 py-1 text-sm text-gray-400 hover:text-white md:block"
                >
                    <span className="sr-only">{t('search')}</span>{' '}
                    {t('submitHint')}
                </button>
            </div>
        </form>
    )
}
