import prisma from '@/lib/prisma'

export class FavoritesModel {
    static async findAllByUser(userId: string) {
        return prisma.userFavoritesList.findMany({ where: { userId } })
    }

    static async findByIdAndUser(id: string, userId: string) {
        return prisma.userFavoritesList.findFirst({ where: { id, userId } })
    }

    static async findByUserAndAnimeId(userId: string, animeId: string) {
        return prisma.userFavoritesList.findFirst({ where: { userId, animeId } })
    }

    static async create(data: {
        userId: string
        animeId: string
        title: string
        picture: string
    }) {
        return prisma.userFavoritesList.create({ data })
    }

    static async deleteByIdAndUser(id: string, userId: string) {
        return prisma.userFavoritesList.delete({ where: { id, userId } })
    }

    static async deleteByUserAndAnimeId(userId: string, animeId: string) {
        const item = await prisma.userFavoritesList.findFirst({
            where: { userId, animeId },
        })
        if (!item) return null
        return prisma.userFavoritesList.delete({ where: { id: item.id } })
    }

    static async upsertMany(
        userId: string,
        items: { animeId: string; title: string; picture: string }[]
    ) {
        return prisma.$transaction(
            items.map((item) =>
                prisma.userFavoritesList.upsert({
                    where: {
                        userId_animeId: { userId, animeId: item.animeId },
                    },
                    create: { userId, ...item },
                    update: {},
                })
            )
        )
    }

    static async updateCompleted(id: string, completed: boolean) {
        return prisma.userFavoritesList.update({
            where: { id },
            data: { completed },
        })
    }
}
