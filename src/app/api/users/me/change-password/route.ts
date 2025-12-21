import { NextRequest } from 'next/server'
import * as userService from '@/services/userService'
import {
    successResponse,
    errorResponse,
    handleError,
} from '@/lib/utils/apiResponse'
import { requireAuth } from '@/lib/Auth/authMiddleware'
import { changePasswordSchema } from '@/lib/validations/userSchema'

/**
 * POST /api/users/me/change-password
 * Change user password
 */
export async function POST(request: NextRequest) {
    try {
        const { error, session } = await requireAuth()

        if (error) {
            return error
        }

        const body = await request.json()
        const validatedData = changePasswordSchema.parse(body)

        await userService.changePassword(
            session!.user.id,
            validatedData.currentPassword,
            validatedData.newPassword
        )

        return successResponse(
            { message: 'Password changed successfully' },
            200
        )
    } catch (error) {
        if (
            error instanceof Error &&
            error.message === 'Current password is incorrect'
        ) {
            return errorResponse(
                'Current password is incorrect',
                400,
                'INVALID_PASSWORD'
            )
        }
        return handleError(error)
    }
}
