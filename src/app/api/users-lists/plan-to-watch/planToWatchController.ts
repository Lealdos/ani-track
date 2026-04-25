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
import { PlanToWatchService } from './planToWatchService'

type Params = { params: Promise<{ id: string }> }

export class PlanToWatchController {
    static async getAll(request: NextRequest) {
        try {
            const session = await auth.api.getSession({
                headers: request.headers,
            })
            if (!session?.user?.id)
                return errorResponse('Unauthorized', 401, 'UNAUTHORIZED')
            const items = await PlanToWatchService.getAll(session.user.id)
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
            const item = await PlanToWatchService.add(session.user.id, data)
            return successResponse(item, 201)
        } catch (error) {
            if (error instanceof ZodError) return zodErrorResponse(error)
            return handleError(error)
        }
    }

    static async updateCompleted(request: NextRequest, { params }: Params) {
        try {
            const session = await auth.api.getSession({
                headers: request.headers,
            })
            if (!session?.user?.id)
                return errorResponse('Unauthorized', 401, 'UNAUTHORIZED')
            const body = await request.json()
            const { completed, animeID } = body
            const item = await PlanToWatchService.updateCompleted(
                animeID,
                session.user.id,
                completed
            )
            return successResponse(item)
        } catch (error) {
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
            await PlanToWatchService.remove(id, session.user.id)
            return successResponse({ id })
        } catch (error) {
            return handleError(error)
        }
    }
}
