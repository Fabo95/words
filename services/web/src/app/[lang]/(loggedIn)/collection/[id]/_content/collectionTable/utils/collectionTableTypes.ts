import { CefrLevel, ExampleSentence, UniversalPosTag } from "@app/utils/entities/translationDetails"

export type CollectionTranslation = {
	id: number
	translationId: number
	sourceLanguage: string
	sourceText: string
	targetLanguage: string
	targetText: string
	cefrLevel?: CefrLevel
	universalPosTags: UniversalPosTag[]
	exampleSentences: ExampleSentence[]
}
