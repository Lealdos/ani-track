import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import {
    successResponse,
    errorResponse,
    handleError,
} from '@/lib/utils/apiResponse'
import prisma from '@/lib/prisma'

type RouteParams = { params: Promise<{ id: string }> }

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params
        const session = await auth.api.getSession({ headers: request.headers })

        if (!session?.user?.id) {
            return errorResponse('Unauthorized', 401, 'UNAUTHORIZED')
        }

        const item = await prisma.finishedAnimeList.findFirst({
            where: { id, userId: session.user.id },
        })
        if (!item) {
            return errorResponse('Item not found', 404, 'NOT_FOUND')
        }

        await prisma.finishedAnimeList.delete({ where: { id } })

        return successResponse({ id })
    } catch (error) {
        return handleError(error)
    }
}
