import prisma from '@/lib/prisma'
import { createNotFoundError } from '@/lib/utils/errors'
type TrackingCreateData = {
    userId: string
    animeId: string
    title: string
    picture: string
}

export class FinishedAnimeModel {
    static async findAllByUser(userId: string) {
        return prisma.finishedAnimeList.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        })
    }

    static async findByUserAndAnime(userId: string, animeId: string) {
        return prisma.finishedAnimeList.findFirst({
            where: { userId, animeId },
        })
    }

    static async findByIdAndUser(id: string, userId: string) {
        return prisma.finishedAnimeList.findFirst({ where: { id, userId } })
    }

    static async create(data: TrackingCreateData) {
        return prisma.finishedAnimeList.create({ data })
    }

    static async updateCompleted(id: string, completed: boolean) {
        return prisma.finishedAnimeList.update({
            where: { id },
            data: { completed },
        })
    }

    static async delete(id: string) {
        return prisma.finishedAnimeList.delete({ where: { id } })
    }

    static async moveFromCurrentWatching(
        id: string,
        userId: string,
        completed = true
    ) {
        const item = await prisma.currentWatching.findFirst({
            where: { id, userId },
        })
        if (!item) throw createNotFoundError('Item')
        const { animeId, title, picture } = item
        const finishedItem = await prisma.finishedAnimeList.create({
            data: { userId, animeId, title, picture, completed },
        })
        await prisma.currentWatching.delete({ where: { id } })
        return finishedItem
    }
}
