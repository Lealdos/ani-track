import {
    successResponse,
    errorResponse,
    handleError,
} from '@/lib/utils/apiResponse'
import { getSession } from '@/lib/Auth/authMiddleware'

/**
 * GET /api/auth/session
 * Get current session information
 */
export async function GET() {
    try {
        const session = await getSession()

        if (!session) {
            return errorResponse('No active session', 401, 'NO_SESSION')
        }

        return successResponse({
            user: session.user,
            session: {
                expiresAt: session.session.expiresAt,
            },
        })
    } catch (error) {
        return handleError(error)
    }
}
