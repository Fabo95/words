import { InngestFunctionsFactory } from "@/setup/dependencies/factories/inngestFunctionsFactory.js"
import { diContainer, fastifyAwilixPlugin } from "@fastify/awilix"
import cors from "@fastify/cors"
import { captureException } from "@sentry/node"
import { tryCatchSync } from "backend-lib"
import Fastify, { FastifyBaseLogger } from "fastify"
import {
	hasZodFastifySchemaValidationErrors,
	isResponseSerializationError,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod"
import { nanoid } from "nanoid"
import router from "./router.js"
import { healthCheckRoute } from "./routes/health-check.js"
import { I_AppDependenciesFactory } from "./setup/dependencies/factories/appDependenciesFactory.js"
import { CacheServicesFactory } from "./setup/dependencies/factories/cacheServicesFactory.js"
import { I_ClientsFactory } from "./setup/dependencies/factories/clientsFactory.js"
import { CommonServicesFactory } from "./setup/dependencies/factories/commonServicesFactory.js"
import { ModelServicesFactory } from "./setup/dependencies/factories/modelServicesFactory.js"
import { createCradle, createRequestCradle } from "./setup/dependencies/setup.js"
import { docsPlugin } from "./setup/docsPlugin.js"
import { logger } from "./setup/logger.js"
import { ApiError } from "./utils/errors/apiError.js"
import { captureToSentryErrorCodes } from "./utils/errors/errorCodes.js"

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
		genReqId: () => nanoid(10),
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

		fastify.addHook("onSend", async (request, reply, payload) => {
			const { data, error } = tryCatchSync(() => JSON.parse(payload as string))
			const path = reply.request?.routeOptions?.url

			request.log.info(
				{
					url: request.url,
					path: path ? `${reply.request.method} ${path}` : `not found`,
					method: request.method,
					statusCode: reply.statusCode,
					responseTimeMs: reply.elapsedTime,
					responseBody: !error ? data : payload,
				},
				"Sending response",
			)

			return payload
		})
	}

	fastify.setValidatorCompiler(validatorCompiler)
	fastify.setSerializerCompiler(serializerCompiler)

	fastify.register(docsPlugin)

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

	fastify.setErrorHandler((err, req, reply) => {
		// handling
		let apiError: ApiError | undefined = undefined

		if (hasZodFastifySchemaValidationErrors(err)) {
			apiError = new ApiError("validation", "Validation error in req Validation", {
				issues: err.validation.map((e) => e.params.issue),
				location: err.validation.map((e) => e.schemaPath),
			})
		}

		if (isResponseSerializationError(err)) {
			// this error occurs when the defined response schema does not match the actual response
			apiError = new ApiError("internalServerError", "Response serialization error (please report this)")
		}

		if (err instanceof ApiError) {
			apiError = err
		}

		if (err.name === "FastifyError" && err.statusCode === 400) {
			apiError = new ApiError("badRequest", err.message)
		}

		if (!apiError) {
			apiError = new ApiError("internalServerError", "An unexpected / unhandled error occurred")
		}

		if (captureToSentryErrorCodes.includes(apiError.data.error.code)) {
			captureException(err)
		}

		req.log.error({ message: "returning error", apiError, err })

		return reply.code(apiError.data.httpStatus).send(apiError.getErrorJson({ reqId: req.id }))
	})

	return fastify
}
