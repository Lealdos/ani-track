import { NextRequest } from 'next/server'
import * as userService from '@/services/userService'
import {
    successResponse,
    errorResponse,
    handleError,
} from '@/lib/utils/apiResponse'
import { requireAuth } from '@/lib/Auth/authMiddleware'

/**
 * GET /api/users/me
 * Get current user profile
 */
export async function GET() {
    try {
        const { error, session } = await requireAuth()

        if (error) {
            return error
        }

        const user = await userService.getUserById(session!.user.id)

        if (!user) {
            return errorResponse('User not found', 404, 'NOT_FOUND')
        }

        return successResponse(user)
    } catch (error) {
        return handleError(error)
    }
}

/**
 * PATCH /api/users/me
 * Update current user profile
 */
export async function PATCH(request: NextRequest) {
    try {
        const { error, session } = await requireAuth()

        if (error) {
            return error
        }

        const body = await request.json()

        const { userUpdateSchema } = await import(
            '@/lib/validations/userSchema'
        )
        const validatedData = userUpdateSchema.parse(body)

        if (
            validatedData.email &&
            validatedData.email !== session!.user.email
        ) {
            const exists = await userService.userExists(validatedData.email)
            if (exists) {
                return errorResponse(
                    'Email already in use',
                    409,
                    'EMAIL_EXISTS'
                )
            }
        }

        const updatedUser = await userService.updateUser(
            session!.user.id,
            validatedData
        )

        return successResponse(updatedUser, 200, {
            message: 'Profile updated successfully',
        })
    } catch (error) {
        return handleError(error)
    }
}

/**
 * DELETE /api/users/me
 * Delete current user account
 */
export async function DELETE() {
    try {
        const { error, session } = await requireAuth()

        if (error) {
            return error
        }

        await userService.deleteUser(session!.user.id)

        return successResponse({ message: 'Account deleted successfully' }, 200)
    } catch (error) {
        return handleError(error)
    }
}
