import { JikanAnime } from '../interfaces/JikanType'

export const imgOf = (a: JikanAnime) =>
    a.images?.webp?.large_image_url ||
    a.images?.jpg?.large_image_url ||
    a.images?.webp?.image_url ||
    a.images?.jpg?.image_url ||
    '/placeholder.svg'

export const HOUR = 3600
export const WEEK = HOUR * 24 * 7
export const DAYS15 = HOUR * 24 * 15
export const MONTH = HOUR * 24 * 30
export const DAY = HOUR * 24
