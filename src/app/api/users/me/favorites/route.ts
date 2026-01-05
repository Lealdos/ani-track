import { NextRequest } from 'next/server'
// import * as userService from '@/services/userService'
import {
    successResponse,
    errorResponse,
    handleError,
} from '@/lib/utils/apiResponse'
import { requireAuth } from '@/lib/Auth/authMiddleware'

/**
 * PATCH /api/users/me/favorites
 * Update user favorites
 */
export async function PATCH(request: NextRequest) {
    try {
        const { error, session } = await requireAuth()

        if (error) {
            return error
        }

        const body = await request.json()

        if (!body.favorites || typeof body.favorites !== 'object') {
            return errorResponse('Invalid favorites data', 400, 'INVALID_DATA')
        }

        const updatedUser = await userService.updateFavorites(
            session!.user.id,
            body.favorites
        )

        return successResponse(updatedUser, 200, {
            message: 'Favorites updated successfully',
        })
    } catch (error) {
        return handleError(error)
    }
}

/**
 * GET /api/users/me/favorites
 * Get user favorites
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

        return successResponse({
            favorites: user.favorites || {},
        })
    } catch (error) {
        return handleError(error)
    }
}
