import { NextRequest } from 'next/server'
import * as userService from '@/services/userService'
import {
    successResponse,
    errorResponse,
    handleError,
} from '@/lib/utils/apiResponse'
import { userLoginSchema } from '@/lib/validations/userSchema'

/**
 * POST /api/auth/verify
 * Verify user credentials (for custom authentication flows)
 * Note: better-auth handles login via /api/auth/[...all]/route
 * This is for verification purposes only
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const validatedData = userLoginSchema.parse(body)

        const user = await userService.getUserByEmailWithPassword(
            validatedData.email
        )

        if (!user) {
            return errorResponse(
                'Invalid credentials',
                401,
                'INVALID_CREDENTIALS'
            )
        }

        const isValid = await userService.verifyPassword(
            validatedData.password,
            user.password
        )

        if (!isValid) {
            return errorResponse(
                'Invalid credentials',
                401,
                'INVALID_CREDENTIALS'
            )
        }

        const { password, ...userWithoutPassword } = user

        return successResponse({
            user: userWithoutPassword,
            verified: true,
        })
    } catch (error) {
        return handleError(error)
    }
}
