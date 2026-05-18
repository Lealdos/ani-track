import {
    createNotFoundError,
    createAuthorizationError,
} from '@/lib/utils/errors'
import { UserListsModel } from '../_models/userListsModel'

type PublicList = NonNullable<
    Awaited<ReturnType<typeof UserListsModel.findPublicById>>
>

export type PublicListResult =
    | { status: 'not-found' }
    | { status: 'private' }
    | { status: 'public'; list: PublicList }

export class UserListsService {
    static async getAll(userId: string) {
        return UserListsModel.findAllByUser(userId)
    }

    static async getById(id: string, requestingUserId?: string) {
        const list = await UserListsModel.findById(id)
        if (!list) throw createNotFoundError('List')
        if (list.visibility === 'PRIVATE' && list.userId !== requestingUserId)
            throw createAuthorizationError(
                'You do not have access to this list'
            )
        return list
    }

    static async getPublicById(id: string): Promise<PublicListResult> {
        const list = await UserListsModel.findPublicById(id)
        if (!list) return { status: 'not-found' }
        if (list.visibility !== 'PUBLIC') return { status: 'private' }
        return { status: 'public', list }
    }

    static async create(
        userId: string,
        data: { name: string; visibility: string }
    ) {
        return UserListsModel.create({ userId, ...data })
    }

    static async update(
        id: string,
        userId: string,
        data: { name?: string; visibility?: string }
    ) {
        const list = await UserListsModel.findById(id)
        if (!list) throw createNotFoundError('List')
        if (list.userId !== userId) throw createAuthorizationError('Forbidden')
        return UserListsModel.update(id, data)
    }

    static async delete(id: string, userId: string) {
        const list = await UserListsModel.findById(id)
        if (!list) throw createNotFoundError('List')
        if (list.userId !== userId) throw createAuthorizationError('Forbidden')
        await UserListsModel.delete(id)
    }
}
