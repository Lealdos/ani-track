import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getUserLists } from '../_lib/userLists'

export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: request.headers })

        if (!session?.user?.email) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }
        const lists = await getUserLists(session.user.id)

        return NextResponse.json(
            { success: true, data: lists },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
}
