import { InngestFunctionsFactory } from "@/setup/dependencies/factories/inngestFunctionsFactory.js"
import { diContainer, fastifyAwilixPlugin } from "@fastify/awilix"
import cors from "@fastify/cors"
import Fastify, { FastifyBaseLogger } from "fastify"
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod"
import router from "./router.js"
import { healthCheckRoute } from "./routes/health-check.js"
import { I_AppDependenciesFactory } from "./setup/dependencies/factories/appDependenciesFactory.js"
import { I_ClientsFactory } from "./setup/dependencies/factories/clientsFactory.js"
import { CommonServicesFactory } from "./setup/dependencies/factories/commonServicesFactory.js"
import { ModelServicesFactory } from "./setup/dependencies/factories/modelServicesFactory.js"
import { createCradle, createRequestCradle } from "./setup/dependencies/setup.js"
import { logger } from "./setup/logger.js"
import { v4 } from "uuid"

export function createServer({
	withLogger,
	dependencyFactories,
}: {
	withLogger: boolean
	dependencyFactories?: {
		getCradleFactories: () => Promise<{ appDependenciesFactory: I_AppDependenciesFactory }>
		getRequestCradleFactories: (deps: {
			logger: FastifyBaseLogger
			appDependenciesFactory: I_AppDependenciesFactory
		}) => Promise<{
			clientsFactory: I_ClientsFactory
			commonServicesFactory: CommonServicesFactory
			modelServicesFactory: ModelServicesFactory
			inngestFunctionsFactory: InngestFunctionsFactory
		}>
	}
}) {
	const fastify = Fastify({
		loggerInstance: withLogger ? logger : undefined,
		ignoreTrailingSlash: true,
		genReqId: () => v4(),
	})

	fastify.register(cors, {
		origin: [
			"http://localhost:3000",
			"https://partner.neotaste.com",
			"https://partner.staging.neotaste.com",
			/\.ngrok-free\.app$/,
			"https://www.partner.staging.neotaste.com",
		],
		credentials: true,
		exposedHeaders: ["set-cookie"],
	})

	if (withLogger) {
		fastify.addHook("preHandler", (req, _reply, done) => {
			if (req.body) {
				req.log.info({ body: req.body }, "parsed body")
			}
			done()
		})
	}

	fastify.setValidatorCompiler(validatorCompiler)
	fastify.setSerializerCompiler(serializerCompiler)

	// needed for request signing on webhooks (e.g. /webhooks/stripe)
	fastify.register(import("fastify-raw-body"), {
		field: "rawBody",
		global: false,
		encoding: "utf8",
		runFirst: true, // get the body before any preParsing hook change/uncompress it. **Default false**
	})

	fastify.after(async () => {
		// optional because we dont need them to create docs
		if (dependencyFactories) {
			fastify.register(fastifyAwilixPlugin, {
				disposeOnClose: true,
				disposeOnResponse: true,
				strictBooleanEnforced: true,
			})
			const { appDependenciesFactory } = await dependencyFactories.getCradleFactories()
			const cradle = await createCradle(appDependenciesFactory)
			diContainer.register(cradle)

			fastify.addHook("onRequest", async (req, _reply) => {
				const requestCradleFactories = await dependencyFactories.getRequestCradleFactories({
					appDependenciesFactory,
					logger: req.log,
				})

				const requestCradle = await createRequestCradle(requestCradleFactories)
				req.diScope.register(requestCradle)
			})
		}

		await fastify.register(router)
		await fastify.register(healthCheckRoute)
	})

	fastify.setErrorHandler((err, _req, reply) => {
		return reply.code(500).send(err)
	})

	return fastify
}
