import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import {
    successResponse,
    errorResponse,
    zodErrorResponse,
    handleError,
} from '@/lib/utils/apiResponse'
import { addListItemSchema } from '@/lib/validations/listSchema'
import { ZodError } from 'zod'
import prisma from '@/lib/prisma'

type RouteParams = { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, { params }: RouteParams) {
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
        const data = addListItemSchema.parse(body)

        const existing = await prisma.userListItems.findFirst({
            where: { listId: id, animeId: data.animeId },
        })
        if (existing) {
            return errorResponse(
                'This anime is already in the list',
                409,
                'DUPLICATE_RECORD'
            )
        }

        const item = await prisma.userListItems.create({
            data: {
                listId: id,
                animeId: data.animeId,
                title: data.title,
                picture: data.picture,
            },
        })

        return successResponse(item, 201)
    } catch (error) {
        if (error instanceof ZodError) return zodErrorResponse(error)
        return handleError(error)
    }
}
