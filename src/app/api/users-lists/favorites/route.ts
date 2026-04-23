import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { getUserFavoriteList } from '@/app/api/_lib/userFavoriteList'
import {
    successResponse,
    errorResponse,
    handleError,
} from '@/lib/utils/apiResponse'

export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: request.headers })

        if (!session?.user?.id) {
            return errorResponse('Unauthorized', 401, 'UNAUTHORIZED')
        }

        const lists = await getUserFavoriteList(session.user.id)

        return successResponse(lists)
    } catch (error) {
        return handleError(error)
    }
}
