import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import {
    successResponse,
    errorResponse,
    zodErrorResponse,
    handleError,
} from '@/lib/utils/apiResponse'
import { addTrackingItemSchema } from '@/lib/validations/trackingSchema'
import { ZodError } from 'zod'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: request.headers })

        if (!session?.user?.id) {
            return errorResponse('Unauthorized', 401, 'UNAUTHORIZED')
        }

        const items = await prisma.finishedAnimeList.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
        })

        return successResponse(items)
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
        const data = addTrackingItemSchema.parse(body)

        const existing = await prisma.finishedAnimeList.findFirst({
            where: { userId: session.user.id, animeId: data.animeId },
        })
        if (existing) {
            return errorResponse(
                'This anime is already in your finished list',
                409,
                'DUPLICATE_RECORD'
            )
        }

        const item = await prisma.finishedAnimeList.create({
            data: {
                userId: session.user.id,
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
