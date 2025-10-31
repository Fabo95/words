import { Inngest } from "@/clients/inngest.js"
import { getInngestCronFunctions } from "@/utils/inngest/functions/cronFunctions/index.js"
import { getInngestEventFunctions } from "@/utils/inngest/functions/eventFunctions/index.js"
import { TranslationsModelService } from "@/services/model/translationsModelService.js"

export type InngestFunctions = ReturnType<typeof getInngestFunctions>

type InngestFunctionsDeps = {
	inngest: Inngest
	translationsModelService: TranslationsModelService
}

export const getInngestFunctions = ({ inngest, translationsModelService }: InngestFunctionsDeps) => [
	...getInngestEventFunctions({
		inngest,
		translationsModelService,
	}),
	...getInngestCronFunctions({
		inngest,
	}),
]
