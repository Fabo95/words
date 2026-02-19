import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"

/**
 * Health check for load balancer.
 */
export function healthCheckRoute(fastify: FastifyInstance) {
	fastify.withTypeProvider<ZodTypeProvider>().get(
		"/health",
		{
			schema: {
				response: {
					200: z.object({
						success: z.literal(true),
					}),
				},
			},
		},
		async (_req, reply) => {
			reply.status(200).send({
				success: true,
			})
		},
	)
}
