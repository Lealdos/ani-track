import { z } from 'zod'

// const animeSchema = z.object({
//     mal_id: z.number(),
//     url: z.url(),
//     images: z.object({
//         jpg: z.object({
//             image_url: z.string().url(),
//             small_image_url: z.string().url(),
//         }),
//     }),
//     title: z.string(),
//     })
export const userSchema = z.object({
    email: z.email(),
    password: z.string().min(8, 'Password must have at least 8 characters'),
    fullName: z.string().min(2),
    nickname: z.string().optional(),
    favorites: z.array(z.unknown()).optional(), //   refine later
})

export type UserSchema = z.infer<typeof userSchema>
