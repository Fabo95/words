import { z } from "zod";

const envSchema = z.object({
    API_BASE_URL: z.string().min(1, {message: "API_BASE_URL is required"}),
})

export const ENV = envSchema.parse({API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL});