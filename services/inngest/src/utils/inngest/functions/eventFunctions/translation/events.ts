import { Inngest } from "@/clients/inngest.js"
import { TranslationsModelService } from "@/services/model/translationsModelService.js"

type InngestEntityEventFunctionsDeps = {
	inngest: Inngest
	translationsModelService: TranslationsModelService
}

export const getInngestTranslationEventFunctions = ({
	inngest,
	translationsModelService,
}: InngestEntityEventFunctionsDeps) => {
	const userUpdated = inngest.createFunction(
		{ id: "translation.created" },
		{ event: "translation.created" },
		async ({ step, event }) => {
			const te = await translationsModelService.findUnique({ id: event.data.translationId })

			return te
		},
	)

	return [userUpdated]
}
