import { env } from '@/env.js'
import { PrismaClient } from '@/generated/user-db/client.js'

let prismaUserDb: PrismaClient | null = null

export function getUserDbPrisma(): PrismaClient {
    if (!prismaUserDb) {
        prismaUserDb = new PrismaClient({
            datasourceUrl: env.DATABASE_URL,
        })
    }

    return prismaUserDb
}
