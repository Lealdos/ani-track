import { createNotFoundError, createConflictError } from '@/lib/utils/errors'
import { CurrentWatchingModel } from './currentWatchingModel'

export type TrackingInput = {
    animeId: string
    title: string
    picture: string
    completed?: boolean
}

export class CurrentWatchingService {
    static async getAll(userId: string) {
        return CurrentWatchingModel.findAllByUser(userId)
    }

    static async add(userId: string, data: TrackingInput) {
        const existing = await CurrentWatchingModel.findByUserAndAnime(
            userId,
            data.animeId
        )
        if (existing)
            throw createConflictError(
                'This anime is already in your watching list'
            )
        return CurrentWatchingModel.create({ userId, ...data })
    }

    static async remove(id: string, userId: string) {
        const item = await CurrentWatchingModel.findByIdAndUser(id, userId)
        if (!item) throw createNotFoundError('Item')
        await CurrentWatchingModel.delete(id)
    }

    static async updateCompleted(
        id: string,
        userId: string,
        completed: boolean
    ) {
        const item = await CurrentWatchingModel.findByIdAndUser(id, userId)
        if (!item) throw createNotFoundError('Item')
        return CurrentWatchingModel.updateCompleted(id, completed)
    }
}
