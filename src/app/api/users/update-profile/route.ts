import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function PATCH(request: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: request.headers })

        if (!session?.user?.email) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { name, userName, image } = await request.json()

        // Validate inputs
        if (!name || !userName) {
            return NextResponse.json(
                { message: 'Name and username are required' },
                { status: 400 }
            )
        }

        // Check if userName is already taken by another user
        const existingUser = await prisma.user.findFirst({
            where: {
                userName: userName,
                NOT: {
                    email: session.user.email,
                },
            },
        })

        if (existingUser) {
            return NextResponse.json(
                { message: 'Username is already taken' },
                { status: 400 }
            )
        }

        // Update user profile
        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: {
                name,
                userName,
                image: image || undefined,
            },
            select: {
                id: true,
                name: true,
                userName: true,
                email: true,
                image: true,
            },
        })

        return NextResponse.json(updatedUser, { status: 200 })
    } catch (error) {
        console.error('Error updating profile:', error)
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}
