import { z } from 'zod'

export const createListSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
    visibility: z.enum(['PRIVATE', 'PUBLIC']).default('PRIVATE'),
})

export const updateListSchema = z
    .object({
        name: z
            .string()
            .min(1, 'Name is required')
            .max(100, 'Name is too long')
            .optional(),
        visibility: z.enum(['PRIVATE', 'PUBLIC']).optional(),
    })
    .refine((data) => data.name !== undefined || data.visibility !== undefined, {
        message: 'At least one field (name or visibility) must be provided',
    })

export const addListItemSchema = z.object({
    animeId: z.string().min(1, 'Anime ID is required'),
    title: z.string().min(1, 'Title is required'),
    picture: z.string().optional().default(''),
})
