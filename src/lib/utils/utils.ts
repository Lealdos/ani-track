import { JikanAnime } from '@/services/JikanAPI/interfaces/JikanType'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { searchParamsProps } from '@/types/SearchParamsProps'

export function mergeClassNames(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function removeDuplicates(array: JikanAnime[]) {
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

// Filter out null and undefined values from the search params
export function FilterAndStringifySearchParams(rawParams: searchParamsProps) {
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

// Add this function at the top of the file, after imports
export function convertJSTToLocal(broadcastString: string | undefined): string {
    if (!broadcastString) return 'Unknown time'

    // Parse the broadcast string (e.g., "Saturdays at 23:45 (JST)")
    const match = broadcastString.match(/(\w+)s at (\d{1,2}):(\d{2})/)
    if (!match) return broadcastString

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, dayName, hourStr, minuteStr] = match
    const hour = parseInt(hourStr, 10)
    const minute = parseInt(minuteStr, 10)

    // Get current date
    const now = new Date()

    // Create a date string in JST timezone (UTC+9)
    const jstDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00+09:00`

    // Parse this as a date (will be converted to local timezone)
    const localDate = new Date(jstDateStr)

    // Format the local time
    const localTimeStr = localDate.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
    })

    return `${localTimeStr} local`
}
