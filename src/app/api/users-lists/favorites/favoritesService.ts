import { createNotFoundError } from '@/lib/utils/errors'
import { FavoritesModel } from './favoritesModel'

export class FavoritesService {
    static async getAll(userId: string) {
        return FavoritesModel.findAllByUser(userId)
    }

    static async add(
        userId: string,
        animeId: string,
        title: string,
        picture: string
    ) {
        const existing = await FavoritesModel.findByUserAndAnimeId(
            userId,
            animeId
        )
        if (existing) return existing
        return FavoritesModel.create({ userId, animeId, title, picture })
    }

    static async remove(userId: string, animeId: string) {
        const deleted = await FavoritesModel.deleteByUserAndAnimeId(
            userId,
            animeId
        )
        if (!deleted) throw createNotFoundError('Favorite')
        return deleted
    }

    static async sync(
        userId: string,
        items: { animeId: string; title: string; picture: string }[]
    ) {
        if (items.length === 0) return []
        await FavoritesModel.upsertMany(userId, items)
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
