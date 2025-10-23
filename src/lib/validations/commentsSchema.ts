import { z } from 'zod'

export const commentsSchema = z.object({
    pageId: z.string(),
    content: z.string().min(1),
    parentId: z.string().optional(),
})
