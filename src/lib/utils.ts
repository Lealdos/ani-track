import { Anime } from '@/types/anime'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { searchParamsProps } from '@/types/SearchParamsProps'

export function mergeClassNames(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function removeDuplicates(array: Anime[]) {
    const uniqueSet = new Set()

    return array.filter((obj) => {
        const objString = JSON.stringify(obj)
        if (!uniqueSet.has(objString)) {
            uniqueSet.add(objString)
            return true
        }
        return false
    })
}

export function formatDate(date: Date, locale = 'en-US') {
    const FormattedDate = new Date(date).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
    return FormattedDate
}

export function FilterAndStringifySearchParams(rawParams: searchParamsProps) {
    // Filter out null and undefined values from the search params
    return Object.fromEntries(
        Object.entries(rawParams)
            .filter(([key, value]) => {
                return value !== null && key in rawParams && value !== undefined
            })
            .map(([key, value]) => [
                key,
                value !== undefined ? String(value) : '',
            ])
    )
}
