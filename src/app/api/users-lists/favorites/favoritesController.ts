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

    static async add(request: NextRequest) {
        try {
            const session = await auth.api.getSession({
                headers: request.headers,
            })
            if (!session?.user?.id)
                return errorResponse('Unauthorized', 401, 'UNAUTHORIZED')
            const { animeId, title, picture } = await request.json()
            if (!animeId || !title)
                return errorResponse(
                    'animeId and title are required',
                    400,
                    'VALIDATION_ERROR'
                )
            const item = await FavoritesService.add(
                session.user.id,
                String(animeId),
                title,
                picture ?? ''
            )
            return successResponse(item, 201)
        } catch (error) {
            return handleError(error)
        }
    }

    static async remove(request: NextRequest) {
        try {
            const session = await auth.api.getSession({
                headers: request.headers,
            })
            if (!session?.user?.id)
                return errorResponse('Unauthorized', 401, 'UNAUTHORIZED')
            const { animeId } = await request.json()
            if (!animeId)
                return errorResponse(
                    'animeId is required',
                    400,
                    'VALIDATION_ERROR'
                )
            const deleted = await FavoritesService.remove(
                session.user.id,
                String(animeId)
            )
            return successResponse(deleted)
        } catch (error) {
            return handleError(error)
        }
    }

    static async sync(request: NextRequest) {
        try {
            const session = await auth.api.getSession({
                headers: request.headers,
            })
            if (!session?.user?.id)
                return errorResponse('Unauthorized', 401, 'UNAUTHORIZED')
            const { items } = await request.json()
            if (!Array.isArray(items))
                return errorResponse(
                    'items must be an array',
                    400,
                    'VALIDATION_ERROR'
                )
            const sanitized = items.map(
                (i: { animeId: string; title: string; picture?: string }) => ({
                    animeId: String(i.animeId),
                    title: String(i.title),
                    picture: String(i.picture ?? ''),
                })
            )
            const favorites = await FavoritesService.sync(
                session.user.id,
                sanitized
            )
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
