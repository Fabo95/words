import { Inngest } from "@/clients/inngest.js"
import { TranslationsModelService } from "@/services/model/translationsModelService.js"
import { OpenAi } from "@/clients/openAi.js"
import { ExampleSentencesModelService } from "@/services/model/exampleSentencesModelService.js"
import { CefrLevelsModelService } from "@/services/model/cefrLevelsModelsService.js"

type InngestEntityEventFunctionsDeps = {
	openAi: OpenAi
	inngest: Inngest
	translationsModelService: TranslationsModelService
	exampleSentencesModelService: ExampleSentencesModelService
	cefrLevelsModelService: CefrLevelsModelService
}

export const getInngestTranslationEventFunctions = ({
	openAi,
	inngest,
	translationsModelService,
	exampleSentencesModelService,
	cefrLevelsModelService,
}: InngestEntityEventFunctionsDeps) => {
	const checkTransaltion = inngest.createFunction(
		{ id: "check_translation" },
		{ event: "translation.created" },
		async ({ step, event }) => {
			const translation = await translationsModelService.findUnique({ id: event.data.translationId })

			if (!translation) throw new Error(`Translation with id ${event.data.translationId} not found`)

			const { corrected_by_ai, ...checkedTranslation } = await openAi.checkTranslation(translation)

			if (corrected_by_ai) {
				await translationsModelService.update({ id: translation.id }, checkedTranslation)
			}

			await inngest.send({ name: "translation.checked", data: { translationId: translation.id } })

			return { correctedByAi: corrected_by_ai, checkedTranslation }
		},
	)

	const generateCefrLevel = inngest.createFunction(
		{ id: "assign_cefr_level" },
		{ event: "translation.checked" },
		async ({ step, event }) => {
			const translation = await translationsModelService.findUnique({ id: event.data.translationId })

			if (!translation) throw new Error(`Translation with id ${event.data.translationId} not found`)

			const { cefr_level } = await openAi.getCefrLevel(translation)

			const cefrLevel = await cefrLevelsModelService.findFirst({ code: cefr_level })

			if (!cefrLevel) throw new Error(`Cefr level with code ${cefr_level} not found`)

			await translationsModelService.update({ id: translation.id }, { cefr_level_id: cefrLevel.id })

			await inngest.send({ name: "translation.cefr_assigned", data: { translationId: translation.id } })

			return { cefrLevel }
		},
	)

	const generateExampleSentences = inngest.createFunction(
		{ id: "generate_example_sentences" },
		{ event: "translation.cefr_assigned" },
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

	return [checkTransaltion, generateCefrLevel, generateExampleSentences]
}
