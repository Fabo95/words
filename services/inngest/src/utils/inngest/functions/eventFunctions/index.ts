import { Inngest } from "@/clients/inngest.js"
import { getInngestTranslationEventFunctions } from "@/utils/inngest/functions/eventFunctions/translation/events.js"
import { TranslationsModelService } from "@/services/model/translationsModelService.js"
import { OpenAi } from "@/clients/openAi.js"
import { ExampleSentencesModelService } from "@/services/model/exampleSentencesModelService.js"

type InngestEventFunctionsDeps = {
	openAi: OpenAi
	inngest: Inngest
	translationsModelService: TranslationsModelService
	exampleSentencesModelService: ExampleSentencesModelService
}

export const getInngestEventFunctions = ({
	openAi,
	inngest,
	translationsModelService,
	exampleSentencesModelService,
}: InngestEventFunctionsDeps) => [
	...getInngestTranslationEventFunctions({
		openAi,
		inngest,
		translationsModelService,
		exampleSentencesModelService,
	}),
]
