import prisma from '@/lib/prisma'
import bcrypt from 'bcrypt'
import type {
    UserRegistrationSchemaType,
    UserUpdateSchemaType,
} from '@/lib/validations/userSchema'
import type { UserUpdateInput } from '@/generated/prisma/models/User'
import type * as runtime from '@prisma/client/runtime/client'

const SALT_ROUNDS = 12

/**
 * User select object without password
 */
const userSelectWithoutPassword = {
    id: true,
    email: true,
    fullName: true,
    nickname: true,
    favorites: true,
    createdAt: true,
    updatedAt: true,
}

/**
 * Create a new user
 */
export async function createUser(data: UserRegistrationSchemaType) {
    const { password, ...userData } = data

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    const user = await prisma.user.create({
        data: {
            ...userData,
            password: hashedPassword,
        },
        select: userSelectWithoutPassword,
    })

    return user
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: userSelectWithoutPassword,
    })

    return user
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
        where: { email },
        select: userSelectWithoutPassword,
    })

    return user
}

/**
 * Get user by email with password (for authentication)
 */
export async function getUserByEmailWithPassword(email: string) {
    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            password: true,
            fullName: true,
            nickname: true,
            favorites: true,
            createdAt: true,
            updatedAt: true,
        },
    })

    return user
}

/**
 * Update user
 */
export async function updateUser(userId: string, data: UserUpdateSchemaType) {
    const updateData: UserUpdateInput = {}

    if (data.password) {
        updateData.password = await bcrypt.hash(data.password, SALT_ROUNDS)
    }

    if (data.email) updateData.email = data.email
    if (data.fullName) updateData.fullName = data.fullName
    if (data.nickname !== undefined) updateData.nickname = data.nickname
    if (data.favorites !== undefined) {
        updateData.favorites = data.favorites as runtime.InputJsonValue
    }

    const user = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: userSelectWithoutPassword,
    })

    return user
}

/**
 * Delete user
 */
export async function deleteUser(userId: string) {
    await prisma.user.delete({
        where: { id: userId },
    })

    return { success: true }
}

/**
 * Verify user password
 */
export async function verifyPassword(
    plainPassword: string,
    hashedPassword: string
): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword)
}

/**
 * Change user password
 */
export async function changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { password: true },
    })

    if (!user) {
        throw new Error('User not found')
    }

    const isValid = await verifyPassword(currentPassword, user.password)
    if (!isValid) {
        throw new Error('Current password is incorrect')
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS)

    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
    })

    return { success: true }
}

/**
 * List users with pagination
 */
export async function listUsers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            skip,
            take: limit,
            select: {
                id: true,
                email: true,
                fullName: true,
                nickname: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        }),
        prisma.user.count(),
    ])

    return {
        users,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    }
}

/**
 * Check if user exists by email
 */
export async function userExists(email: string): Promise<boolean> {
    const count = await prisma.user.count({
        where: { email },
    })
    return count > 0
}

/**
 * Update user favorites
 */
export async function updateFavorites(
    userId: string,
    favorites: Record<string, unknown>
) {
    const user = await prisma.user.update({
        where: { id: userId },
        data: { favorites: favorites as runtime.InputJsonValue },
        select: userSelectWithoutPassword,
    })

    return user
}
