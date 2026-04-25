import prisma from '@/lib/prisma'

export class UserListItemsModel {
    static async findByListAndAnime(listId: string, animeId: string) {
        return prisma.userListItems.findFirst({ where: { listId, animeId } })
    }

    static async findByIdAndList(id: string, listId: string) {
        return prisma.userListItems.findFirst({ where: { id, listId } })
    }

    static async create(data: { listId: string; animeId: string; title: string; picture: string }) {
        return prisma.userListItems.create({ data })
    }

    static async delete(id: string) {
        return prisma.userListItems.delete({ where: { id } })
    }
}
