import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import {
    successResponse,
    errorResponse,
    handleError,
} from '@/lib/utils/apiResponse'
import { FavoritesService } from './favoritesService'

type Params = { params: Promise<{ id: string }> }

export class FavoritesController {
    static async getAll(request: NextRequest) {
        try {
            const session = await auth.api.getSession({
                headers: request.headers,
            })
            if (!session?.user?.id)
                return errorResponse('Unauthorized', 401, 'UNAUTHORIZED')
            const favorites = await FavoritesService.getAll(session.user.id)
            return successResponse(favorites)
        } catch (error) {
            return handleError(error)
        }
    }

    static async updateCompleted(request: NextRequest, { params }: Params) {
        try {
            const { id } = await params
            const session = await auth.api.getSession({
                headers: request.headers,
            })
            if (!session?.user?.id)
                return errorResponse('Unauthorized', 401, 'UNAUTHORIZED')
            const body = await request.json()
            const { completed } = body
            const item = await FavoritesService.updateCompleted(
                id,
                session.user.id,
                completed
            )
            return successResponse(item)
        } catch (error) {
            return handleError(error)
        }
    }
}
