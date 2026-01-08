// Qv8De8d5KYpjVMhcc2SvOiQar5tYkipE

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getUserFavoriteList } from '@/app/api/_lib/userFavoriteList'
import { headers } from 'next/headers'

export async function GET(request: NextRequest) {
    try {
        const sessionInfo = await auth.api.getSession({
            headers: await headers(),
        })

        console.log('Session user:', sessionInfo?.user.id)

        if (!sessionInfo?.user.id) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        const lists = await getUserFavoriteList(sessionInfo?.user.id)

        return NextResponse.json(
            { success: true, data: lists },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
}
