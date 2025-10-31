import dotenv from "dotenv"
import z from "zod"

dotenv.config()

const schema = z.object({
	ENVIRONMENT: z.enum(["development", "test", "production", "staging"]).default("production"),
	DATABASE_URL: z.string(),

	INNGEST_DEV: z.string(),
	INNGEST_EVENT_KEY: z.string(),
	INNGEST_BASE_URL: z.string().url().optional(),
	INNGEST_SIGNING_KEY: z.string(),
	INNGEST_SIGNING_KEY_FALLBACK: z.string(),
	INNGEST_SERVE_HOST: z.string().url(),
})

const parsed = schema.safeParse(process.env)

if (!parsed.success) {
	const errorMessage = "❌ Invalid environment variables"
	console.log(errorMessage, JSON.stringify(parsed.error.format(), null, 4))
	process.exit(1)
}

export const env = parsed.data
