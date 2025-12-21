import { NextRequest } from 'next/server'
import * as userService from '@/services/userService'
import { successResponse, handleError } from '@/lib/utils/apiResponse'
import { requireAuth } from '@/lib/Auth/authMiddleware'

/**
 * GET /api/users
 * List all users with pagination (authenticated users only)
 */
export async function GET(request: NextRequest) {
    try {
        const { error } = await requireAuth()

        if (error) {
            return error
        }

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1', 10)
        const limit = parseInt(searchParams.get('limit') || '10', 10)

        const validPage = Math.max(1, page)
        const validLimit = Math.min(Math.max(1, limit), 100)

        const result = await userService.listUsers(validPage, validLimit)

        return successResponse(result.users, 200, {
            pagination: result.pagination,
        })
    } catch (error) {
        return handleError(error)
    }
}
