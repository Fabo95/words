import crypto from 'node:crypto'
import basicAuth from '@fastify/basic-auth'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { DOCS_CREDENTIALS } from '@internal/constants'
import { tryCatchSync } from 'backend-lib'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import { jsonSchemaTransform } from 'fastify-type-provider-zod'

export const docsPlugin = fastifyPlugin(
    async (fastify: FastifyInstance, _opts: FastifyPluginOptions) => {
        await fastify.register(basicAuth, {
            validate(username, password, _req, _reply, done) {
                let result = true
                result = compare(username, DOCS_CREDENTIALS.username) && result
                result = compare(password, DOCS_CREDENTIALS.password) && result
                if (result) {
                    done()
                } else {
                    done(new Error('Access denied'))
                }
            },
            authenticate: true,
        })

        fastify.register(fastifySwagger, {
            openapi: {
                info: {
                    title: 'User API Fastify',
                    description: 'The user API built with Fastify',
                    version: '1.0.0',
                },
                servers: [],
            },
            transform: jsonSchemaTransform,
        })

        fastify.register(fastifySwaggerUI, {
            routePrefix: '/users/docs',
            uiHooks: {
                onRequest: fastify.basicAuth,
            },
        })
    },
    {
        name: 'docs-plugin',
    }
)

function compare(a: string, b: string) {
    const abuf = Buffer.from(a)
    const bbuf = Buffer.from(b)
    if (abuf.length !== bbuf.length) {
        tryCatchSync(() => crypto.timingSafeEqual(abuf, abuf))
        return false
    }
    const { data } = tryCatchSync(() => crypto.timingSafeEqual(abuf, bbuf))
    return data ?? false
}
