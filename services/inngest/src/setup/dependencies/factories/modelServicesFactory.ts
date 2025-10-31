import { PrismaClient } from "@/generated/user-db/client.js"
import { FastifyBaseLogger } from "fastify"

interface ModelServicesFactoryDeps {
	prisma: PrismaClient
	logger: FastifyBaseLogger
}

export class ModelServicesFactory {
	private modelServices = {}
	private deps: ModelServicesFactoryDeps

	constructor(deps: ModelServicesFactoryDeps) {
		this.deps = deps
	}
}
