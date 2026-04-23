import { JikanAnime } from '../interfaces/JikanType'

export const imgOf = (a: JikanAnime) =>
    a.images?.webp?.large_image_url ||
    a.images?.jpg?.large_image_url ||
    a.images?.webp?.image_url ||
    a.images?.jpg?.image_url ||
    '/placeholder.svg'
