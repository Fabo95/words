import { z } from "zod"

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

export const learnItemSchema = z.object({
	id: z.number(),
	sourceText: z.string(),
	targetText: z.string(),
	isNew: z.boolean(),
})

export type LearnItem = z.infer<typeof learnItemSchema>

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type LearningProgressApiResponse = any

export interface LearnItemApiResponse {
	id: number
	user_id: number
	collection_id?: number | null

	// CEFR Data
	cefr_level_id?: number | null
	cefr_level?: CefrLevel | null

	// Content
	source_language: string
	source_text: string
	target_language: string
	target_text: string

	// Arrays
	example_sentences: ExampleSentence[]
	universal_pos_tags: UniversalPosTag[]

	// Status flags
	is_due: boolean
	is_new: boolean
	learning_progress?: LearningProgressApiResponse | null

	// Timestamps (represented as ISO strings)
	created_at: string
	updated_at: string
}

export type ExampleSentence = { id: number; language: string; sentence: string; translation_id: number }

export type UniversalPosTag = {
	code: string
	description?: string | null
	id: number
	name: string
}

// what your API actually returns
export type TranslationApiResponse = {
	id: number
	source_text: string
	target_text: string
	source_language: string
	target_language: string
	collection_id?: number | null
	cefr_level_id?: number | null
	cefr_level?: {
		id: number
		code: string
		name: string
		description?: string | null
	} | null
	universal_pos_tags: {
		id: number
		code: string
		name: string
		description?: string | null
	}[]
	example_sentences: {
		id: number
		sentence: string
		language: string
		translation_id: number
	}[]
	created_at: string
	updated_at: string
	user_id: number
}

export function mapTranslationResponseToTranslation(api: TranslationApiResponse): Translation {
	return {
		id: api.id,
		translationId: api.id, // intentional duplication (UI convenience)
		sourceText: api.source_text,
		targetText: api.target_text,

		cefrLevel: api.cefr_level
			? {
					id: api.cefr_level.id,
					code: api.cefr_level.code,
					name: api.cefr_level.name,
					description: api.cefr_level.description ?? null,
				}
			: undefined,

		universalPosTags: api.universal_pos_tags.map((tag) => ({
			id: tag.id,
			code: tag.code,
			name: tag.name,
			description: tag.description ?? null,
		})),

		exampleSentences: api.example_sentences.map((ex) => ({
			id: ex.id,
			language: ex.language,
			sentence: ex.sentence,
			translation_id: ex.translation_id,
		})),
	}
}
