import { inngestServeRoute } from "@/routes/inngest/serve/latest.js"
import { FastifyInstance } from "fastify"

export default function router(fastify: FastifyInstance) {
	// inngest
	fastify.register(inngestServeRoute)
}
