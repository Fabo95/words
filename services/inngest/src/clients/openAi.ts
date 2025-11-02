import OpenAI from "openai"
import { env } from "@/env.js"
import z from "zod"

export type CheckTranslationInput = {
	source_language: string
	source_text: string
	target_language: string
	target_text: string
}

const CheckTranslationResultSchema = z
	.object({
		source_language: z.string().min(1),
		source_text: z.string().min(1),
		target_language: z.string().min(1),
		target_text: z.string().min(1),
		corrected_by_ai: z.boolean().optional(),
	})
	.strict()

export type CheckTranslationResult = z.infer<typeof CheckTranslationResultSchema>

export type GenerateExampleSentencesInput = {
	source_language: string
	source_text: string
	target_language: string
	target_text: string
}

const ExampleSentencesSchema = z
	.object({
		source_example_sentence: z.string().min(1, "source_example_sentence is empty"),
		target_example_sentence: z.string().min(1, "target_example_sentence is empty"),
	})
	.strict()

export type GenerateExampleSentencesResult = z.infer<typeof ExampleSentencesSchema>

const CefrLevelSchema = z
	.object({
		cefr_level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
		reasoning: z.string().optional(),
	})
	.strict()

export type GetCefrLevelInput = {
	source_language: string
	source_text: string
	target_language: string
	target_text: string
}

export type GetCefrLevelResult = z.infer<typeof CefrLevelSchema>

export class OpenAi {
	private client: OpenAI

	constructor() {
		this.client = new OpenAI({ apiKey: env.OPENAI_API_KEY })
	}

	/**
	 * Checks the translation and returns the same shape (plus you compute corrected_by_ai yourself).
	 * - Never changes language codes.
	 * - Ensures source_text is in source_language and target_text is in target_language.
	 * - If needed, it rewrites texts to satisfy those constraints and to be a faithful translation.
	 */
	async checkTranslation(input: CheckTranslationInput): Promise<CheckTranslationResult> {
		const { source_language, source_text, target_language, target_text } = input

		const system = [
			"You are a bilingual evaluator and corrector for language translations.",
			"CRITICAL RULES:",
			"- source_language and target_language are language codes (ISO 639-1 combined with ISO 3166-1 alpha-2), like en-GB or de-DE.",
			"- If source_text is not in the source_language, take the source_text, translate it to the source_language.",
			"- If target_text is not in the target_language, take the source_text, translate it to the target_language.",
			"- If source_text is incorrect/inaccurate/unnatural/ungrammatical, rewrite it to a faithful, natural translation.",
			"- If target_text is incorrect/inaccurate/unnatural/ungrammatical, rewrite it to a faithful, natural translation.",
			"- If everything is correct, return the original input.",
			"- Preserve meaning, tone, and register.",
			"OUTPUT:",
			"- Strict JSON, single line, with EXACT keys: source_language, source_text, target_language, target_text.",
			"- No extra keys, no code fences, no commentary.",
		].join("\n")

		// Few-shot to prevent swapping languages
		const example_user = [
			"source_language: en-GB",
			"source_text: sofort",
			"target_language: de-DE",
			"target_text: immediately",
			"",
			"Output format:",
			'{"source_language":"en-GB","source_text":"immediately","target_language":"de-DE","target_text":"sofort"}',
		].join("\n")

		const user = [
			`source_language: ${source_language}`,
			`source_text: ${source_text}`,
			`target_language: ${target_language}`,
			`target_text: ${target_text}`,
			"",
			"Output format (strict JSON, one line):",
			`{"source_language":"${source_language}","source_text":"...","target_language":"${target_language}","target_text":"..."}`,
		].join("\n")

		const res = await this.client.chat.completions.create({
			model: "gpt-4o-mini",
			temperature: 0, // be deterministic; we want compliance, not creativity
			messages: [
				{ role: "system", content: system },
				{ role: "user", content: example_user },
				{ role: "user", content: user },
			],
		})

		const raw = res.choices?.[0]?.message?.content?.trim() ?? ""
		if (!raw) throw new Error("No translation check result")

		// tolerant JSON parse
		let candidate: unknown
		try {
			candidate = JSON.parse(raw)
		} catch {
			const cleaned = raw.replace(/```json|```/g, "").trim()
			candidate = JSON.parse(cleaned)
		}

		const parsed = CheckTranslationResultSchema.safeParse(candidate)
		if (!parsed.success) {
			const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")
			throw new Error(`Invalid model output: ${issues}`)
		}

		const corrected_by_ai =
			parsed.data.target_text.trim() !== target_text.trim() ||
			parsed.data.source_text.trim() !== source_text.trim() ||
			parsed.data.source_language.trim() !== source_language.trim() ||
			parsed.data.target_language.trim() !== target_language.trim()

		return {
			source_language: parsed.data.source_language,
			source_text: parsed.data.source_text,
			target_language: parsed.data.target_language,
			target_text: parsed.data.target_text,
			corrected_by_ai,
		}
	}

	/**
	 * Generates two example sentences:
	 * - source_example_sentence: a natural sentence in the source_language that uses the source_text naturally.
	 * - target_example_sentence: a natural sentence in the target_language that uses the target_text naturally.
	 */
	async generateExampleSentences(input: GenerateExampleSentencesInput): Promise<GenerateExampleSentencesResult> {
		const { source_language, source_text, target_language, target_text } = input

		const system = [
			"You generate natural, concise example sentences for language learners.",
			"Constraints:",
			"- Output strictly JSON with two keys: source_example_sentence and target_example_sentence.",
			"- Each value is exactly ONE sentence.",
			"- Max 18 words per sentence.",
			"- No quotes, no explanations, no extra keys, no code fences.",
			"- Avoid uncommon names; prefer neutral, everyday contexts.",
			"- Use correct grammar and natural phrasing in the requested language.",
			"- Do not translate anything beyond producing the sentences.",
		].join("\n")

		const user = [
			`source_language: ${source_language}`,
			`source_text: ${source_text}`,
			`target_language: ${target_language}`,
			`target_text: ${target_text}`,
			"",
			"Task:",
			"- Create source_example_sentence in source_language using source_text naturally.",
			"- Create target_example_sentence in target_language using target_text naturally.",
			"",
			"Output format (strict JSON, single line):",
			`{"source_example_sentence":"...", "target_example_sentence":"..."}`,
		].join("\n")

		const res = await this.client.chat.completions.create({
			model: "gpt-4o-mini",
			temperature: 0.6,
			messages: [
				{ role: "system", content: system },
				{ role: "user", content: user },
			],
		})

		const raw = res.choices?.[0]?.message?.content?.trim() ?? ""
		if (!raw) throw new Error("No example sentences generated")

		// Parse JSON (be tolerant to minor formatting issues)
		let candidate: unknown
		try {
			candidate = JSON.parse(raw)
		} catch {
			const cleaned = raw
				.replace(/```json|```/g, "")
				.replace(/^\s*Output:\s*/i, "")
				.trim()
			candidate = JSON.parse(cleaned)
		}

		// Validate with zod
		const parsed = ExampleSentencesSchema.safeParse(candidate)

		if (!parsed.success) {
			// Provide a helpful error
			const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")
			throw new Error(`Invalid model output: ${issues}`)
		}

		return {
			source_example_sentence: parsed.data.source_example_sentence,
			target_example_sentence: parsed.data.target_example_sentence,
		}
	}

	/**
	 * Estimates the CEFR language level (A1–C2) for the given translation.
	 * The model considers both source_text and target_text complexity.
	 */
	async getCefrLevel(input: GetCefrLevelInput): Promise<GetCefrLevelResult> {
		const { source_language, source_text, target_language, target_text } = input

		const system = [
			"You are a linguistics expert specialized in CEFR classification (A1–C2).",
			"Task:",
			"- Analyze the translation pair for difficulty and vocabulary complexity.",
			"- Consider grammar, idiomaticity, and abstractness.",
			"- Output JSON with two keys: cefr_level and reasoning.",
			"- cefr_level must be exactly one of: A1, A2, B1, B2, C1, C2.",
			"- reasoning: one short English sentence explaining why.",
			"- Output must be strict JSON, one line, no code fences, no quotes around keys.",
		].join("\n")

		const user = [
			`source_language: ${source_language}`,
			`source_text: ${source_text}`,
			`target_language: ${target_language}`,
			`target_text: ${target_text}`,
			"",
			"Output format:",
			`{"cefr_level":"A2","reasoning":"Simple structure and common words."}`,
		].join("\n")

		const res = await this.client.chat.completions.create({
			model: "gpt-4o-mini",
			temperature: 0.2,
			messages: [
				{ role: "system", content: system },
				{ role: "user", content: user },
			],
		})

		const raw = res.choices?.[0]?.message?.content?.trim() ?? ""
		if (!raw) throw new Error("No CEFR level generated")

		let candidate: unknown
		try {
			candidate = JSON.parse(raw)
		} catch {
			const cleaned = raw.replace(/```json|```/g, "").trim()
			candidate = JSON.parse(cleaned)
		}

		const parsed = CefrLevelSchema.safeParse(candidate)
		if (!parsed.success) {
			const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")
			throw new Error(`Invalid model output: ${issues}`)
		}

		return parsed.data
	}
}
