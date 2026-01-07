import prisma from '@/lib/prisma'

export async function getUserLists(userId: string) {
    try {
        const lists = await prisma.userLists.findMany({
            where: {
                userId: userId,
            },
            include: {
                listItems: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return lists
    } catch (error) {
        console.error('Error fetching user lists:', error)
        return []
    }
}
