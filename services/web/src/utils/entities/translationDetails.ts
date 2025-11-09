export type TranslationDetails = {
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

type CefrLevel = {
	code: string
	description?: string | null
	id: number
	name: string
}

type ExampleSentence = { id: number; language: string; sentence: string; translation_id: number }

type UniversalPosTag = {
	code: string
	description?: string | null
	id: number
	name: string
}
