import { NextRequest } from 'next/server'
import { ZodError } from 'zod'
import { auth } from '@/lib/auth'
import { createListSchema, updateListSchema } from '@/lib/validations/listSchema'
import {
    successResponse,
    errorResponse,
    zodErrorResponse,
    handleError,
} from '@/lib/utils/apiResponse'
import { UserListsService } from '../_services/userListsService'

type Params = { params: Promise<{ id: string }> }

export class UserListsController {
    static async getAll(request: NextRequest) {
        try {
            const session = await auth.api.getSession({ headers: request.headers })
            if (!session?.user?.id) return errorResponse('Unauthorized', 401, 'UNAUTHORIZED')
            const lists = await UserListsService.getAll(session.user.id)
            return successResponse(lists)
        } catch (error) {
            return handleError(error)
        }
    }

    static async createList(request: NextRequest) {
        try {
            const session = await auth.api.getSession({ headers: request.headers })
            if (!session?.user?.id) return errorResponse('Unauthorized', 401, 'UNAUTHORIZED')
            const body = await request.json()
            const data = createListSchema.parse(body)
            const list = await UserListsService.create(session.user.id, data)
            return successResponse(list, 201)
        } catch (error) {
            if (error instanceof ZodError) return zodErrorResponse(error)
            return handleError(error)
        }
    }

    static async getById(request: NextRequest, { params }: Params) {
        try {
            const { id } = await params
            const session = await auth.api.getSession({ headers: request.headers })
            const list = await UserListsService.getById(id, session?.user?.id)
            return successResponse(list)
        } catch (error) {
            return handleError(error)
        }
    }

    static async updateList(request: NextRequest, { params }: Params) {
        try {
            const { id } = await params
            const session = await auth.api.getSession({ headers: request.headers })
            if (!session?.user?.id) return errorResponse('Unauthorized', 401, 'UNAUTHORIZED')
            const body = await request.json()
            const data = updateListSchema.parse(body)
            const updated = await UserListsService.update(id, session.user.id, data)
            return successResponse(updated)
        } catch (error) {
            if (error instanceof ZodError) return zodErrorResponse(error)
            return handleError(error)
        }
    }

    static async deleteList(request: NextRequest, { params }: Params) {
        try {
            const { id } = await params
            const session = await auth.api.getSession({ headers: request.headers })
            if (!session?.user?.id) return errorResponse('Unauthorized', 401, 'UNAUTHORIZED')
            await UserListsService.delete(id, session.user.id)
            return successResponse({ id })
        } catch (error) {
            return handleError(error)
        }
    }
}
