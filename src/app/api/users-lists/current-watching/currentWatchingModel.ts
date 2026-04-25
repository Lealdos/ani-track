import prisma from '@/lib/prisma'

type TrackingCreateData = {
    userId: string
    animeId: string
    title: string
    picture: string
}

export class CurrentWatchingModel {
    static async findAllByUser(userId: string) {
        return prisma.currentWatching.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        })
    }

    static async findByUserAndAnime(userId: string, animeId: string) {
        return prisma.currentWatching.findFirst({ where: { userId, animeId } })
    }

    static async findByIdAndUser(id: string, userId: string) {
        return prisma.currentWatching.findFirst({ where: { id, userId } })
    }

    static async create(data: TrackingCreateData) {
        return prisma.currentWatching.create({ data })
    }

    static async updateCompleted(id: string, completed: boolean) {
        return prisma.currentWatching.update({
            where: { id },
            data: { completed },
        })
    }

    static async delete(id: string) {
        return prisma.currentWatching.delete({ where: { id } })
    }
}
