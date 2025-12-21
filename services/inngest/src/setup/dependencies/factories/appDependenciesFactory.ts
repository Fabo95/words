import { PrismaClient } from "@/generated/user-db/client.js"
import { getPrisma } from "@/setup/database/prisma.js"

export interface AppDependencies {
	prisma?: PrismaClient
}

export interface I_AppDependenciesFactory {
	getPrisma: () => Promise<PrismaClient>
}

export class AppDependenciesFactory implements I_AppDependenciesFactory {
	private appDependencies: AppDependencies = {}

	async getPrisma() {
		if (!this.appDependencies.prisma) {
			this.appDependencies.prisma = getPrisma()
			await this.appDependencies.prisma.$connect()
		}
		return this.appDependencies.prisma
	}
}
