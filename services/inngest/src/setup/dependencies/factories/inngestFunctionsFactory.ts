import { I_ClientsFactory } from "@/setup/dependencies/factories/clientsFactory.js"
import { InngestFunctions, getInngestFunctions } from "@/utils/inngest/functions/index.js"
import { ModelServicesFactory } from "@/setup/dependencies/factories/modelServicesFactory.js"

export interface InngestFunctionsFactoryDeps {
	clientsFactory: I_ClientsFactory
	modelServicesFactory: ModelServicesFactory
}

export interface I_InngestFunctionsFactory {
	getInngestFunctions: () => InngestFunctions
}

export class InngestFunctionsFactory implements I_InngestFunctionsFactory {
	private deps: InngestFunctionsFactoryDeps
	private inngestFunctions: InngestFunctions

	constructor(deps: InngestFunctionsFactoryDeps) {
		this.deps = deps
	}

	public getInngestFunctions() {
		if (!this.inngestFunctions) {
			this.inngestFunctions = getInngestFunctions({
				openAi: this.deps.clientsFactory.getOpenAi(),
				inngest: this.deps.clientsFactory.getInngest(),
				translationsModelService: this.deps.modelServicesFactory.getTranslationsModelService(),
				exampleSentencesModelService: this.deps.modelServicesFactory.getExampleSentencesModelService(),
				cefrLevelsModelService: this.deps.modelServicesFactory.getCefrLevelsModelService(),
				universalPosTagsModelService: this.deps.modelServicesFactory.getUniversalPosTagsModelService(),
				translationsUniversalPosTagsModelService:
					this.deps.modelServicesFactory.getTranslationsUniversalPosTagsModelService(),
			})
		}

		return this.inngestFunctions
	}
}
