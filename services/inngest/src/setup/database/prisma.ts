import { env } from "@/env.js"
import { PrismaClient } from "@/generated/user-db/client.js"

let prisma: PrismaClient | null = null

export function getPrisma(): PrismaClient {
	if (!prisma) {
		prisma = new PrismaClient({
			datasourceUrl: env.DATABASE_URL,
		})
	}

	return prisma
}
