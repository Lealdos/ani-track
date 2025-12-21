import { NextRequest } from 'next/server'
import * as userService from '@/services/userService'
import {
    successResponse,
    errorResponse,
    handleError,
} from '@/lib/utils/apiResponse'
import { requireAuth } from '@/lib/Auth/authMiddleware'

/**
 * GET /api/users/:id
 * Get user by ID (public profile)
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const user = await userService.getUserById(id)

        if (!user) {
            return errorResponse('User not found', 404, 'NOT_FOUND')
        }

        const publicProfile = {
            id: user.id,
            fullName: user.fullName,
            nickname: user.nickname,
            createdAt: user.createdAt,
        }

        return successResponse(publicProfile)
    } catch (error) {
        return handleError(error)
    }
}

/**
 * PATCH /api/users/:id
 * Update user by ID (owner only)
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { error, session } = await requireAuth()

        if (error) {
            return error
        }

        const { id } = await params

        if (session!.user.id !== id) {
            return errorResponse(
                'Forbidden - You can only update your own profile',
                403,
                'FORBIDDEN'
            )
        }

        const body = await request.json()
        const { userUpdateSchema } = await import(
            '@/lib/validations/userSchema'
        )
        const validatedData = userUpdateSchema.parse(body)

        if (validatedData.email) {
            const currentUser = await userService.getUserById(id)
            if (currentUser && validatedData.email !== currentUser.email) {
                const exists = await userService.userExists(validatedData.email)
                if (exists) {
                    return errorResponse(
                        'Email already in use',
                        409,
                        'EMAIL_EXISTS'
                    )
                }
            }
        }

        const updatedUser = await userService.updateUser(id, validatedData)

        return successResponse(updatedUser, 200, {
            message: 'User updated successfully',
        })
    } catch (error) {
        return handleError(error)
    }
}

/**
 * DELETE /api/users/:id
 * Delete user by ID (owner only)
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { error, session } = await requireAuth()

        if (error) {
            return error
        }

        const { id } = await params

        if (session!.user.id !== id) {
            return errorResponse(
                'Forbidden - You can only delete your own account',
                403,
                'FORBIDDEN'
            )
        }

        await userService.deleteUser(id)

        return successResponse({ message: 'User deleted successfully' }, 200)
    } catch (error) {
        return handleError(error)
    }
}
