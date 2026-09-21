'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

import { useRouter } from '@/i18n/navigation'

import { Search } from 'lucide-react'

import * as styles from './headerClasses'

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
            <div className={styles.searchWrap}>
                <Search className={styles.searchIcon} />
                <input
                    type="search"
                    placeholder={t('placeholder')}
                    className={styles.searchField}
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
