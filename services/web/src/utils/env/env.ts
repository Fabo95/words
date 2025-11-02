import { z } from "zod"

const envSchema = z.object({
	API_BASE_URL: z.string().min(1, { message: "API_BASE_URL is required" }),
	NEXT_PUBLIC_DEPLOYMENT_URL: z.string().url(),
})

export const ENV = envSchema.parse({
	API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
	NEXT_PUBLIC_DEPLOYMENT_URL: process.env.NEXT_PUBLIC_DEPLOYMENT_URL,
})
