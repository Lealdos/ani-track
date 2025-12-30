import { z } from 'zod'

const AnimeFavoriteListSchema = z.object({
    id: z.string(),
    name: z.string(),
    imageUrl: z.url(),
})
// User registration schema
export const userRegistrationSchema = z.object({
    email: z.email('Invalid email address'),
    password: z
        .string()
        .min(8, 'Password must have at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    fullName: z.string().min(2, 'Full name must have at least 2 characters'),
    userName: z.string().min(2).max(50),
})

// User login schema
export const userLoginSchema = z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
})

// User update schema (all fields optional)
export const userUpdateSchema = z.object({
    email: z.email('Invalid email address').optional(),
    password: z
        .string()
        .min(8, 'Password must have at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .optional(),
    fullName: z
        .string()
        .min(2, 'Full name must have at least 2 characters')
        .optional(),
    nickname: z.string().min(2).max(50).optional().nullable(),
    favorites: z.array(AnimeFavoriteListSchema).nullable(),
})

// Change password schema
export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
        .string()
        .min(8, 'Password must have at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
})

// Password reset request schema
export const resetPasswordRequestSchema = z.object({
    email: z.email('Invalid email address'),
})

// Password reset schema
export const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Token is required'),
    newPassword: z
        .string()
        .min(8, 'Password must have at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
})

// User response schema (no password)
export const userResponseSchema = z.object({
    id: z.string(),
    email: z.email(),
    fullName: z.string(),
    nickname: z.string().nullable(),
    favorites: z.array(AnimeFavoriteListSchema).nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

// Legacy schema for backward compatibility
export const userSchema = userRegistrationSchema

// Types
export type UserRegistrationSchemaType = z.infer<typeof userRegistrationSchema>
export type UserLoginSchemaType = z.infer<typeof userLoginSchema>
export type UserUpdateSchemaType = z.infer<typeof userUpdateSchema>
export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>
export type ResetPasswordRequestSchemaType = z.infer<
    typeof resetPasswordRequestSchema
>
export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>
export type UserResponseSchemaType = z.infer<typeof userResponseSchema>
export type UserSchemaType = z.infer<typeof userSchema>
