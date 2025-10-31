import { Inngest } from "@/clients/inngest.js"
import { getInngestTranslationEventFunctions } from "@/utils/inngest/functions/eventFunctions/translation/events.js"
import { TranslationsModelService } from "@/services/model/translationsModelService.js"

type InngestEventFunctionsDeps = {
	inngest: Inngest
	translationsModelService: TranslationsModelService
}

export const getInngestEventFunctions = ({ inngest, translationsModelService }: InngestEventFunctionsDeps) => [
	...getInngestTranslationEventFunctions({
		inngest,
		translationsModelService,
	}),
]
