import { env } from '@/env.js'
import { FastifyInstance } from 'fastify'
import { serve } from 'inngest/fastify'

type InngestQS = { Querystring: Record<string, string | undefined> }

export function inngestServeRoute(fastify: FastifyInstance) {
    fastify.route<InngestQS>({
        method: ['GET', 'POST', 'PUT'],
        url: '/users/inngest/serve',
        handler: async (req, reply) => {
            const { inngest: inngestClient } = req.diScope.resolve('inngest')
            const inngestFunctions = req.diScope.resolve('inngestFunctions')

            const inngestHandler = serve({
                client: inngestClient,
                functions: inngestFunctions,
                signingKey: env.INNGEST_SIGNING_KEY,
                signingKeyFallback: env.INNGEST_SIGNING_KEY_FALLBACK,
                serveHost: env.INNGEST_SERVE_HOST,
                servePath: '/users/inngest/serve',
            })

            return inngestHandler(req, reply)
        },
    })
}
