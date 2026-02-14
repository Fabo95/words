import { InngestFunctionsFactory } from "@/setup/dependencies/factories/inngestFunctionsFactory.js"
import { Cradle, RequestCradle } from "@fastify/awilix"
import { NameAndRegistrationPair, asFunction, asValue } from "awilix"
import { I_AppDependenciesFactory } from "./factories/appDependenciesFactory.js"
import { I_ClientsFactory } from "./factories/clientsFactory.js"
import { CommonServicesFactory } from "./factories/commonServicesFactory.js"
import { ModelServicesFactory } from "./factories/modelServicesFactory.js"

async function createCradle(
	appDependenyFactory: I_AppDependenciesFactory,
): Promise<Required<NameAndRegistrationPair<Cradle>>> {
	return {
		prisma: asValue(await appDependenyFactory.getPrisma()),
	}
}

async function createRequestCradle(requerstCradleFactories: {
	clientsFactory: I_ClientsFactory
	commonServicesFactory: CommonServicesFactory
	modelServicesFactory: ModelServicesFactory
	inngestFunctionsFactory: InngestFunctionsFactory
}): Promise<Required<NameAndRegistrationPair<RequestCradle>>> {
	return {
		inngest: asFunction(() => requerstCradleFactories.clientsFactory.getInngest()),

		openAi: asFunction(() => requerstCradleFactories.clientsFactory.getOpenAi()),

		inngestFunctions: asFunction(() => requerstCradleFactories.inngestFunctionsFactory.getInngestFunctions()),

		translationsModelService: asFunction(() =>
			requerstCradleFactories.modelServicesFactory.getTranslationsModelService(),
		),

		exampleSentencesModelService: asFunction(() =>
			requerstCradleFactories.modelServicesFactory.getExampleSentencesModelService(),
		),

		cefrLevelsModelService: asFunction(() => requerstCradleFactories.modelServicesFactory.getCefrLevelsModelService()),
		universalPosTagsModelService: asFunction(() =>
			requerstCradleFactories.modelServicesFactory.getUniversalPosTagsModelService(),
		),
		translationsUniversalPosTagsModelService: asFunction(() =>
			requerstCradleFactories.modelServicesFactory.getTranslationsUniversalPosTagsModelService(),
		),
		userDailyGoalsModelService: asFunction(() =>
			requerstCradleFactories.modelServicesFactory.getUserDailyGoalsModelService(),
		),
		dailyStatisticsModelService: asFunction(() =>
			requerstCradleFactories.modelServicesFactory.getDailyStatisticsModelService(),
		),
		learningProgressModelService: asFunction(() =>
			requerstCradleFactories.modelServicesFactory.getLearningProgressModelService(),
		),
	}
}

export { createCradle, createRequestCradle }
