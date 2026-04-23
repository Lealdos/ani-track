import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import {
    successResponse,
    errorResponse,
    handleError,
} from '@/lib/utils/apiResponse'
import prisma from '@/lib/prisma'

type RouteParams = { params: Promise<{ id: string; itemId: string }> }

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id, itemId } = await params
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

        const item = await prisma.userListItems.findFirst({
            where: { id: itemId, listId: id },
        })
        if (!item) {
            return errorResponse('Item not found', 404, 'NOT_FOUND')
        }

        await prisma.userListItems.delete({ where: { id: itemId } })

        return successResponse({ id: itemId })
    } catch (error) {
        return handleError(error)
    }
}
