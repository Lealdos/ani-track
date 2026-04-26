import { NextRequest } from 'next/server'
import { ZodError } from 'zod'
import { auth } from '@/lib/auth'
import { addListItemSchema } from '@/lib/validations/listSchema'
import {
    successResponse,
    errorResponse,
    zodErrorResponse,
    handleError,
} from '@/lib/utils/apiResponse'
import { UserListItemsService } from '../_services/userListItemsService'

type ListParams = { params: Promise<{ id: string }> }
type ItemParams = { params: Promise<{ id: string; itemId: string }> }

export class UserListItemsController {
    static async addItem(request: NextRequest, { params }: ListParams) {
        try {
            const { id } = await params
            const session = await auth.api.getSession({ headers: request.headers })
            if (!session?.user?.id) return errorResponse('Unauthorized', 401, 'UNAUTHORIZED')
            const body = await request.json()
            const data = addListItemSchema.parse(body)
            const item = await UserListItemsService.addItem(id, session.user.id, data)
            return successResponse(item, 201)
        } catch (error) {
            if (error instanceof ZodError) return zodErrorResponse(error)
            return handleError(error)
        }
    }

    static async removeItem(request: NextRequest, { params }: ItemParams) {
        try {
            const { id, itemId } = await params
            const session = await auth.api.getSession({ headers: request.headers })
            if (!session?.user?.id) return errorResponse('Unauthorized', 401, 'UNAUTHORIZED')
            await UserListItemsService.removeItem(id, itemId, session.user.id)
            return successResponse({ id: itemId })
        } catch (error) {
            return handleError(error)
        }
    }
}
