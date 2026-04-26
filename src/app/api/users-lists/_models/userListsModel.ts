import prisma from '@/lib/prisma'

export class UserListsModel {
    static async findAllByUser(userId: string) {
        return prisma.userLists.findMany({
            where: { userId },
            include: {
                listItems: {
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        animeId: true,
                        title: true,
                        picture: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        })
    }

    static async findById(id: string) {
        return prisma.userLists.findUnique({
            where: { id },
            include: { listItems: { orderBy: { createdAt: 'desc' } } },
        })
    }

    static async create(data: {
        userId: string
        name: string
        visibility: string
    }) {
        return prisma.userLists.create({
            data: data as Parameters<typeof prisma.userLists.create>[0]['data'],
            include: { listItems: true },
        })
    }

    static async update(
        id: string,
        data: { name?: string; visibility?: string }
    ) {
        return prisma.userLists.update({
            where: { id },
            data: data as Parameters<typeof prisma.userLists.update>[0]['data'],
            include: { listItems: { orderBy: { createdAt: 'desc' } } },
        })
    }

    static async delete(id: string) {
        return prisma.userLists.delete({ where: { id } })
    }
}
