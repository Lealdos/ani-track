import { z } from 'zod'

export const listSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    items: z.array(z.any()).optional(),
})
