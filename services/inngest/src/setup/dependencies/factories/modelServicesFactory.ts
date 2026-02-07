import { PrismaClient } from "@/generated/user-db/client.js"
import { FastifyBaseLogger } from "fastify"
import { TranslationsModelService } from "@/services/model/translationsModelService.js"
import { ExampleSentencesModelService } from "@/services/model/exampleSentencesModelService.js"
import { CefrLevelsModelService } from "@/services/model/cefrLevelsModelsService.js"
import { UniversalPosTagsModelService } from "@/services/model/universalPosTagsModelService.js"
import { TranslationsUniversalPosTagsModelService } from "@/services/model/translationsUniversalPosTagsModelService.js"
import { UserDailyGoalsModelService } from "@/services/model/userDailyGoalsModelService.js"

interface ModelServicesFactoryDeps {
	prisma: PrismaClient
	logger: FastifyBaseLogger
}

export class ModelServicesFactory {
	private modelServices: {
		translationsModelService?: TranslationsModelService
		exampleSentencesModelService?: ExampleSentencesModelService
		cefrLevelsModelService?: CefrLevelsModelService
		universalPosTagsModelService?: UniversalPosTagsModelService
		translationsUniversalPosTagsModelService?: TranslationsUniversalPosTagsModelService
		userDailyGoalsModelService?: UserDailyGoalsModelService
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

	public getExampleSentencesModelService() {
		if (!this.modelServices.exampleSentencesModelService) {
			this.modelServices.exampleSentencesModelService = new ExampleSentencesModelService({ prisma: this.deps.prisma })
		}
		return this.modelServices.exampleSentencesModelService
	}

	public getCefrLevelsModelService() {
		if (!this.modelServices.cefrLevelsModelService) {
			this.modelServices.cefrLevelsModelService = new CefrLevelsModelService({ prisma: this.deps.prisma })
		}
		return this.modelServices.cefrLevelsModelService
	}

    public getUniversalPosTagsModelService() {
        if (!this.modelServices.universalPosTagsModelService) {
            this.modelServices.universalPosTagsModelService = new UniversalPosTagsModelService({ prisma: this.deps.prisma })
        }
        return this.modelServices.universalPosTagsModelService
    }

	public getTranslationsUniversalPosTagsModelService() {
		if (!this.modelServices.translationsUniversalPosTagsModelService) {
			this.modelServices.translationsUniversalPosTagsModelService = new TranslationsUniversalPosTagsModelService({
				prisma: this.deps.prisma,
			})
		}
		return this.modelServices.translationsUniversalPosTagsModelService
	}

	public getUserDailyGoalsModelService() {
		if (!this.modelServices.userDailyGoalsModelService) {
			this.modelServices.userDailyGoalsModelService = new UserDailyGoalsModelService({ prisma: this.deps.prisma })
		}
		return this.modelServices.userDailyGoalsModelService
	}
}
