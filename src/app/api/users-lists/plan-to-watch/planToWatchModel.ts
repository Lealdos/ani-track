import prisma from '@/lib/prisma'

type TrackingCreateData = {
    userId: string
    animeId: string
    title: string
    picture: string
}

export class PlanToWatchModel {
    static async findAllByUser(userId: string) {
        return prisma.planToWatch.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        })
    }

    static async findByUserAndAnime(userId: string, animeId: string) {
        return prisma.planToWatch.findFirst({
            where: { userId, animeId },
        })
    }

    static async findByIdAndUser(id: string, userId: string) {
        return prisma.planToWatch.findFirst({ where: { id, userId } })
    }

    static async create(data: TrackingCreateData) {
        return prisma.planToWatch.create({ data })
    }

    static async updateCompleted(id: string, completed: boolean) {
        return prisma.planToWatch.update({
            where: { id },
            data: { completed },
        })
    }

    static async delete(id: string) {
        return prisma.planToWatch.delete({ where: { id } })
    }
}
