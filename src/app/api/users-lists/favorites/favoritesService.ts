import { createNotFoundError } from '@/lib/utils/errors'
import { FavoritesModel } from './favoritesModel'

export class FavoritesService {
    static async getAll(userId: string) {
        return FavoritesModel.findAllByUser(userId)
    }

    static async updateCompleted(
        id: string,
        userId: string,
        completed: boolean
    ) {
        const item = await FavoritesModel.findByIdAndUser(id, userId)
        if (!item) throw createNotFoundError('Item')
        return FavoritesModel.updateCompleted(id, completed)
    }
}
