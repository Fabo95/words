import { Inngest } from "@/clients/inngest.js"
import { getInngestCronFunctions } from "@/utils/inngest/functions/cronFunctions/index.js"
import { getInngestEventFunctions } from "@/utils/inngest/functions/eventFunctions/index.js"
import { TranslationsModelService } from "@/services/model/translationsModelService.js"
import { OpenAi } from "@/clients/openAi.js"
import { ExampleSentencesModelService } from "@/services/model/exampleSentencesModelService.js"
import { CefrLevelsModelService } from "@/services/model/cefrLevelsModelsService.js"

export type InngestFunctions = ReturnType<typeof getInngestFunctions>

type InngestFunctionsDeps = {
	openAi: OpenAi
	inngest: Inngest
	translationsModelService: TranslationsModelService
	exampleSentencesModelService: ExampleSentencesModelService
	cefrLevelsModelService: CefrLevelsModelService
}

export const getInngestFunctions = ({
	openAi,
	inngest,
	translationsModelService,
	exampleSentencesModelService,
	cefrLevelsModelService,
}: InngestFunctionsDeps) => [
	...getInngestEventFunctions({
		openAi,
		inngest,
		translationsModelService,
		exampleSentencesModelService,
		cefrLevelsModelService,
	}),
	...getInngestCronFunctions({
		inngest,
	}),
]
