import { Inngest } from "@/clients/inngest.js"
import { getInngestTranslationEventFunctions } from "@/utils/inngest/functions/eventFunctions/translation/events.js"
import { TranslationsModelService } from "@/services/model/translationsModelService.js"
import { OpenAi } from "@/clients/openAi.js"
import { ExampleSentencesModelService } from "@/services/model/exampleSentencesModelService.js"
import { CefrLevelsModelService } from "@/services/model/cefrLevelsModelsService.js"

type InngestEventFunctionsDeps = {
	openAi: OpenAi
	inngest: Inngest
	translationsModelService: TranslationsModelService
	exampleSentencesModelService: ExampleSentencesModelService
	cefrLevelsModelService: CefrLevelsModelService
}

export const getInngestEventFunctions = ({
	openAi,
	inngest,
	translationsModelService,
	exampleSentencesModelService,
	cefrLevelsModelService,
}: InngestEventFunctionsDeps) => [
	...getInngestTranslationEventFunctions({
		openAi,
		inngest,
		translationsModelService,
		exampleSentencesModelService,
		cefrLevelsModelService,
	}),
]
