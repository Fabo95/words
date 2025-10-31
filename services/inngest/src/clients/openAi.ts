import OpenAI from "openai"
import { env } from "@/env.js"
import z from "zod"

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

export class OpenAi {
	private client: OpenAI

	constructor() {
		this.client = new OpenAI({ apiKey: env.OPENAI_API_KEY })
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
}
