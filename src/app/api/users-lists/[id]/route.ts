import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import {
    successResponse,
    errorResponse,
    zodErrorResponse,
    handleError,
} from '@/lib/utils/apiResponse'
import { updateListSchema } from '@/lib/validations/listSchema'
import { ZodError } from 'zod'
import prisma from '@/lib/prisma'

type RouteParams = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params

        const list = await prisma.userLists.findUnique({
            where: { id },
            include: {
                listItems: { orderBy: { createdAt: 'desc' } },
            },
        })

        if (!list) {
            return errorResponse('List not found', 404, 'NOT_FOUND')
        }

        if (list.visibility === 'PRIVATE') {
            const session = await auth.api.getSession({
                headers: request.headers,
            })
            if (!session?.user?.id || session.user.id !== list.userId) {
                return errorResponse(
                    'You do not have access to this list',
                    403,
                    'FORBIDDEN'
                )
            }
        }

        return successResponse(list)
    } catch (error) {
        return handleError(error)
    }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params
        const session = await auth.api.getSession({ headers: request.headers })

        if (!session?.user?.id) {
            return errorResponse('Unauthorized', 401, 'UNAUTHORIZED')
        }

        const list = await prisma.userLists.findUnique({ where: { id } })
        if (!list) {
            return errorResponse('List not found', 404, 'NOT_FOUND')
        }
        if (list.userId !== session.user.id) {
            return errorResponse('Forbidden', 403, 'FORBIDDEN')
        }

        const body = await request.json()
        const data = updateListSchema.parse(body)

        const updated = await prisma.userLists.update({
            where: { id },
            data: {
                ...(data.name !== undefined && { name: data.name }),
                ...(data.visibility !== undefined && {
                    visibility: data.visibility,
                }),
            },
            include: { listItems: { orderBy: { createdAt: 'desc' } } },
        })

        return successResponse(updated)
    } catch (error) {
        if (error instanceof ZodError) return zodErrorResponse(error)
        return handleError(error)
    }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params
        const session = await auth.api.getSession({ headers: request.headers })

        if (!session?.user?.id) {
            return errorResponse('Unauthorized', 401, 'UNAUTHORIZED')
        }

        const list = await prisma.userLists.findUnique({ where: { id } })
        if (!list) {
            return errorResponse('List not found', 404, 'NOT_FOUND')
        }
        if (list.userId !== session.user.id) {
            return errorResponse('Forbidden', 403, 'FORBIDDEN')
        }

        await prisma.userLists.delete({ where: { id } })

        return successResponse({ id }, 200)
    } catch (error) {
        return handleError(error)
    }
}
