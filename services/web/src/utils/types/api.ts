export type Collection = {
	id: number
	name: string
	user_id: number
}

export type Translation = {
	id: number
	translationId: number
	sourceText: string
	targetText: string
	cefrLevel?: CefrLevel
	universalPosTags: UniversalPosTag[]
	exampleSentences: ExampleSentence[]
}

export type CefrLevel = {
	code: string
	description?: string | null
	id: number
	name: string
}

export type ExampleSentence = { id: number; language: string; sentence: string; translation_id: number }

export type UniversalPosTag = {
	code: string
	description?: string | null
	id: number
	name: string
}
