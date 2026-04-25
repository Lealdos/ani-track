import {
    createNotFoundError,
    createAuthorizationError,
    createConflictError,
} from '@/lib/utils/errors'
import { UserListsModel } from '../_models/userListsModel'
import { UserListItemsModel } from '../_models/userListItemsModel'

type AddItemData = { animeId: string; title: string; picture: string }

export class UserListItemsService {
    static async addItem(listId: string, userId: string, data: AddItemData) {
        const list = await UserListsModel.findById(listId)
        if (!list) throw createNotFoundError('List')
        if (list.userId !== userId) throw createAuthorizationError('Forbidden')

        const existing = await UserListItemsModel.findByListAndAnime(
            listId,
            data.animeId
        )
        if (existing)
            throw createConflictError('This anime is already in the list')

        return UserListItemsModel.create({ listId, ...data })
    }

    static async removeItem(listId: string, itemId: string, userId: string) {
        const list = await UserListsModel.findById(listId)
        if (!list) throw createNotFoundError('List')
        if (list.userId !== userId) throw createAuthorizationError('Forbidden')

        const item = await UserListItemsModel.findByIdAndList(itemId, listId)
        if (!item) throw createNotFoundError('Item')

        await UserListItemsModel.delete(itemId)
    }
}
