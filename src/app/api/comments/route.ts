import { prisma } from '@/lib/prisma'
import { commentsSchema } from '@/lib/validations/commentsSchema'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export async function POST(req: Request) {
    try {
        const session = await getServerSession()
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const data = commentsSchema.parse(body)

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })
        if (!user) throw new Error('User not found')

        const comment = await prisma.comment.create({
            data: {
                authorId: user.id,
                pageId: data.pageId,
                content: data.content,
                parentId: data.parentId,
            },
        })

        return NextResponse.json(comment)
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: 'Failed to create comment' },
            { status: 500 }
        )
    }
}
