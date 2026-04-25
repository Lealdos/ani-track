import prisma from '@/lib/prisma'

export class FavoritesModel {
    static async findAllByUser(userId: string) {
        return prisma.userFavoritesList.findMany({ where: { userId } })
    }

    static async findByIdAndUser(id: string, userId: string) {
        return prisma.userFavoritesList.findFirst({ where: { id, userId } })
    }

    static async updateCompleted(id: string, completed: boolean) {
        return prisma.userFavoritesList.update({ where: { id }, data: { completed } })
    }
}
