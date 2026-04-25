import { z } from 'zod'
import { addTrackingItemSchema } from './trackingSchema'
export const listSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    items: z.array(addTrackingItemSchema).optional(),
})
