import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { withAccelerate } from '@prisma/extension-accelerate'

const connectionString =
    process.env.NODE_ENV === 'production'
        ? process.env.DATABASE_URL!
        : process.env.DATABASE_URL_DEV!

const adapter = new PrismaPg({
    connectionString,
})

const globalForPrisma = global as unknown as {
    prisma: PrismaClient
}

const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({ adapter }).$extends(withAccelerate())

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
