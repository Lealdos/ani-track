import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: request.headers })

        if (!session?.user?.email) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { currentPassword, newPassword } = await request.json()

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { message: 'Current password and new password are required' },
                { status: 400 }
            )
        }

        if (newPassword.length < 8) {
            return NextResponse.json(
                { message: 'Password must be at least 8 characters long' },
                { status: 400 }
            )
        }

        // Use better-auth's changePassword method
        try {
            await auth.api.changePassword({
                headers: request.headers,
                body: {
                    newPassword,
                    currentPassword,
                },
            })

            return NextResponse.json(
                { message: 'Password updated successfully' },
                { status: 200 }
            )
        } catch (error) {
            console.error('Password change error:', error)
            return NextResponse.json(
                { message: 'Current password is incorrect' },
                { status: 400 }
            )
        }
    } catch (error) {
        console.error('Error updating password:', error)
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}
