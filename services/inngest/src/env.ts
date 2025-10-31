import dotenv from "dotenv"
import z from "zod"

dotenv.config()

const schema = z.object({
	PORT: z.coerce.number().default(8080),

	ENVIRONMENT: z.enum(["development", "test", "production", "staging"]).default("production"),
	DATABASE_URL: z.string(),

	INNGEST_DEV: z.string(),
	INNGEST_SIGNING_KEY: z.string(),
	INNGEST_SIGNING_KEY_FALLBACK: z.string(),
	INNGEST_SERVE_HOST: z.string().url(),

	OPENAI_API_KEY: z.string(),
})

const parsed = schema.safeParse(process.env)

if (!parsed.success) {
	const errorMessage = "❌ Invalid environment variables"
	console.log(errorMessage, JSON.stringify(parsed.error.format(), null, 4))
	process.exit(1)
}

export const env = parsed.data
