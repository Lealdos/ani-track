import { z } from 'zod'

export const addTrackingItemSchema = z.object({
    animeId: z.string().min(1, 'Anime ID is required'),
    title: z.string().min(1, 'Title is required'),
    picture: z.string().optional().default(''),
})
