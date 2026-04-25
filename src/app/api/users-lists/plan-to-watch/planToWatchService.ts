import { TrackingInput } from '../current-watching/currentWatchingService'
import { PlanToWatchModel } from './planToWatchModel'
import { createNotFoundError, createConflictError } from '@/lib/utils/errors'

export class PlanToWatchService {
    static async getAll(userId: string) {
        return PlanToWatchModel.findAllByUser(userId)
    }

    static async add(userId: string, data: TrackingInput) {
        const existing = await PlanToWatchModel.findByUserAndAnime(
            userId,
            data.animeId
        )
        if (existing)
            throw createConflictError(
                'This anime is already in your plan to watch list'
            )
        return PlanToWatchModel.create({ userId, ...data })
    }

    static async remove(id: string, userId: string) {
        const item = await PlanToWatchModel.findByIdAndUser(id, userId)
        if (!item) throw createNotFoundError('Item')
        await PlanToWatchModel.delete(id)
    }

    static async updateCompleted(
        id: string,
        userId: string,
        completed: boolean
    ) {
        const item = await PlanToWatchModel.findByIdAndUser(id, userId)
        if (!item) throw createNotFoundError('Item')
        return PlanToWatchModel.updateCompleted(id, completed)
    }
}
