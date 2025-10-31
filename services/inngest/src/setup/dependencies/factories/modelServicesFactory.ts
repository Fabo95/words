import { PrismaClient } from "@/generated/user-db/client.js"
import { FastifyBaseLogger } from "fastify"
import { TranslationsModelService } from "@/services/model/translationsModelService.js"

interface ModelServicesFactoryDeps {
	prisma: PrismaClient
	logger: FastifyBaseLogger
}

export class ModelServicesFactory {
	private modelServices: {
		translationsModelService?: TranslationsModelService
	} = {}

	private deps: ModelServicesFactoryDeps

	constructor(deps: ModelServicesFactoryDeps) {
		this.deps = deps
	}

	public getTranslationsModelService() {
		if (!this.modelServices.translationsModelService) {
			this.modelServices.translationsModelService = new TranslationsModelService({ prisma: this.deps.prisma })
		}
		return this.modelServices.translationsModelService
	}
}
