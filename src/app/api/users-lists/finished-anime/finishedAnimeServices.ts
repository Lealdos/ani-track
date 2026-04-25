import { TrackingInput } from '../current-watching/currentWatchingService'
import { FinishedAnimeModel } from './finishedAnimeModel'
import { createNotFoundError, createConflictError } from '@/lib/utils/errors'

export class FinishedAnimeService {
    static async getAll(userId: string) {
        return FinishedAnimeModel.findAllByUser(userId)
    }

    static async markAnimeAsFinished(userId: string, data: TrackingInput) {
        const existing = await FinishedAnimeModel.findByUserAndAnime(
            userId,
            data.animeId
        )
        if (existing)
            throw createConflictError(
                'This anime is already in your finished list'
            )
        return FinishedAnimeModel.create({ userId, ...data })
    }

    static async remove(id: string, userId: string) {
        const item = await FinishedAnimeModel.findByIdAndUser(id, userId)
        if (!item) throw createNotFoundError('Item')
        await FinishedAnimeModel.delete(id)
    }

    static async updateCompleted(
        id: string,
        userId: string,
        completed: boolean
    ) {
        const item = await FinishedAnimeModel.findByIdAndUser(id, userId)
        if (!item) throw createNotFoundError('Item')
        return FinishedAnimeModel.updateCompleted(id, completed)
    }
}
