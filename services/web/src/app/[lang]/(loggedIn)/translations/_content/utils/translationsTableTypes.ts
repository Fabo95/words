import { CefrLevel, ExampleSentence, LearningProgress, UniversalPosTag } from "@app/utils/types/api"

export type TranslationsTableItem = {
	translationId: number
	collectionId?: number
	collectionName?: string
	sourceText: string
	targetText: string
	cefrLevel?: CefrLevel
	universalPosTags: UniversalPosTag[]
	exampleSentences: ExampleSentence[]
	learningProgress?: LearningProgress
}
