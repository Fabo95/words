import { CefrLevel, ExampleSentence, LearningProgress, UniversalPosTag } from "@app/utils/types/api"

export type CollectionTranslation = {
	id: number
	translationId: number
	sourceText: string
	targetText: string
	cefrLevel?: CefrLevel
	universalPosTags: UniversalPosTag[]
	exampleSentences: ExampleSentence[]
	learningProgress?: LearningProgress
}
