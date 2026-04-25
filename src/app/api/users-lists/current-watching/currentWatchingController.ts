import { NextRequest } from 'next/server'
import { ZodError } from 'zod'
import { auth } from '@/lib/auth'
import { addTrackingItemSchema } from '@/lib/validations/trackingSchema'
import {
    successResponse,
    errorResponse,
    zodErrorResponse,
    handleError,
} from '@/lib/utils/apiResponse'
import { CurrentWatchingService } from './currentWatchingService'
import { FinishedAnimeService } from '../finished-anime/finishedAnimeServices'

type Params = { params: Promise<{ id: string }> }

export class CurrentWatchingController {
    static async getAll(request: NextRequest) {
        try {
            const session = await auth.api.getSession({
                headers: request.headers,
            })
            if (!session?.user?.id)
                return errorResponse('Unauthorized', 401, 'UNAUTHORIZED')
            const items = await CurrentWatchingService.getAll(session.user.id)
            return successResponse(items)
        } catch (error) {
            return handleError(error)
        }
    }

    static async addItem(request: NextRequest) {
        try {
            const session = await auth.api.getSession({
                headers: request.headers,
            })
            if (!session?.user?.id)
                return errorResponse('Unauthorized', 401, 'UNAUTHORIZED')
            const body = await request.json()
            const data = addTrackingItemSchema.parse(body)
            const item = await CurrentWatchingService.add(session.user.id, data)
            return successResponse(item, 201)
        } catch (error) {
            if (error instanceof ZodError) return zodErrorResponse(error)
            return handleError(error)
        }
    }

    static async removeItem(request: NextRequest, { params }: Params) {
        try {
            const { id } = await params
            const session = await auth.api.getSession({
                headers: request.headers,
            })
            if (!session?.user?.id)
                return errorResponse('Unauthorized', 401, 'UNAUTHORIZED')
            await CurrentWatchingService.remove(id, session.user.id)
            return successResponse({ id })
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
            const item = await CurrentWatchingService.updateCompleted(
                id,
                session.user.id,
                completed
            )
            return successResponse(item)
        } catch (error) {
            return handleError(error)
        }
    }

    static async moveToFinished(request: NextRequest, { params }: Params) {
        try {
            // const { id } = await params
            const body = await request.json()
            const data = addTrackingItemSchema.parse(body)
            const session = await auth.api.getSession({
                headers: request.headers,
            })
            if (!session?.user?.id)
                return errorResponse('Unauthorized', 401, 'UNAUTHORIZED')
            const item = await FinishedAnimeService.markAnimeAsFinished(
                session.user.id,
                data
            )

            return successResponse(item)
        } catch (error) {
            return handleError(error)
        }
    }
}
