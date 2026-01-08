import prisma from '@/lib/prisma'

export async function getUserFavoriteList(userId: string) {
    console.log('Fetching favorite list for userId:', userId)
    try {
        const favoriteList = await prisma.userFavoritesList.findMany({
            where: {
                userId: userId,
            },
        })

        return favoriteList
    } catch (error) {
        console.error('Error fetching user favorite list:', error)
        return null
    }
}
