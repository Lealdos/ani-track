import { NextRequest } from 'next/server'
import * as userService from '@/services/userService'
import {
    successResponse,
    errorResponse,
    handleError,
} from '@/lib/utils/apiResponse'
import { userRegistrationSchema } from '@/lib/validations/userSchema'

/**
 * POST /api/auth/register
 * Register a new user
 * Note: better-auth handles this by default via /api/auth/[...all]/route
 * This is a custom endpoint for additional registration logic if needed
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const validatedData = userRegistrationSchema.parse(body)

        const exists = await userService.userExists(validatedData.email)
        if (exists) {
            return errorResponse(
                'User with this email already exists',
                409,
                'USER_EXISTS'
            )
        }

        const user = await userService.createUser(validatedData)

        return successResponse(user, 201, {
            message: 'User registered successfully',
        })
    } catch (error) {
        return handleError(error)
    }
}
