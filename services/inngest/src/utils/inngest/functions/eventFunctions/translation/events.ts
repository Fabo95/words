import { Inngest } from "@/clients/inngest.js"
import { TranslationsModelService } from "@/services/model/translationsModelService.js"
import { OpenAi } from "@/clients/openAi.js"
import { ExampleSentencesModelService } from "@/services/model/exampleSentencesModelService.js"

type InngestEntityEventFunctionsDeps = {
	openAi: OpenAi
	inngest: Inngest
	translationsModelService: TranslationsModelService
	exampleSentencesModelService: ExampleSentencesModelService
}

export const getInngestTranslationEventFunctions = ({
	openAi,
	inngest,
	translationsModelService,
	exampleSentencesModelService,
}: InngestEntityEventFunctionsDeps) => {
	const userUpdated = inngest.createFunction(
		{ id: "translation.created" },
		{ event: "translation.created" },
		async ({ step, event }) => {
			const translation = await translationsModelService.findUnique({ id: event.data.translationId })

			if (!translation) throw new Error(`Translation with id ${event.data.translationId} not found`)

			const { target_example_sentence, source_example_sentence } = await openAi.generateExampleSentences(translation)

			const sourceExampleSentence = await exampleSentencesModelService.create({
				translation_id: translation.id,
				sentence: source_example_sentence,
				language: translation.source_language,
			})

			const targetExampleSentence = await exampleSentencesModelService.create({
				translation_id: translation.id,
				sentence: target_example_sentence,
				language: translation.target_language,
			})

			return { sourceExampleSentence, targetExampleSentence }
		},
	)

	return [userUpdated]
}
