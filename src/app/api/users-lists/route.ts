import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { getUserLists } from '../_lib/userLists'
import {
    successResponse,
    errorResponse,
    zodErrorResponse,
    handleError,
} from '@/lib/utils/apiResponse'
import { createListSchema } from '@/lib/validations/listSchema'
import { ZodError } from 'zod'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: request.headers })

        if (!session?.user?.id) {
            return errorResponse('Unauthorized', 401, 'UNAUTHORIZED')
        }

        const lists = await getUserLists(session.user.id)
        return successResponse(lists)
    } catch (error) {
        return handleError(error)
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: request.headers })

        if (!session?.user?.id) {
            return errorResponse('Unauthorized', 401, 'UNAUTHORIZED')
        }

        const body = await request.json()
        const data = createListSchema.parse(body)

        const list = await prisma.userLists.create({
            data: {
                userId: session.user.id,
                name: data.name,
                visibility: data.visibility,
            },
            include: { listItems: true },
        })

        return successResponse(list, 201)
    } catch (error) {
        if (error instanceof ZodError) return zodErrorResponse(error)
        return handleError(error)
    }
}
