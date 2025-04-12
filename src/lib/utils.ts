import { Anime } from '@/types/anime'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
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
