import { InngestFunctionsFactory } from "@/setup/dependencies/factories/inngestFunctionsFactory.js"
import { createServer } from "./server.js"
import { AppDependenciesFactory } from "./setup/dependencies/factories/appDependenciesFactory.js"
import { ClientsFactory } from "./setup/dependencies/factories/clientsFactory.js"
import { CommonServicesFactory } from "./setup/dependencies/factories/commonServicesFactory.js"
import { ModelServicesFactory } from "./setup/dependencies/factories/modelServicesFactory.js"
import { logger } from "./setup/logger.js"
import { env } from "@/env.js"

const fastify = createServer({
	withLogger: true,
	dependencyFactories: {
		getCradleFactories: async () => {
			return {
				appDependenciesFactory: new AppDependenciesFactory(),
			}
		},
		getRequestCradleFactories: async ({ logger, appDependenciesFactory }) => {


            const modelServicesFactory = new ModelServicesFactory({
                prisma: await appDependenciesFactory.getPrisma(),
                logger,
            })

            const clientsFactory = new ClientsFactory({ logger })

			const commonServicesFactory = new CommonServicesFactory({
				logger,
			})

			const inngestFunctionsFactory = new InngestFunctionsFactory({
				clientsFactory,
				modelServicesFactory,
			})

			return {
				commonServicesFactory,
				clientsFactory,
				modelServicesFactory,
				inngestFunctionsFactory,
			}
		},
	},
})

try {
	const port = env.PORT
	await fastify.listen({ port, host: "0.0.0.0" })
} catch (err) {
	fastify.log.error(err)
	process.exit(1)
}

// Graceful shutdown: ECS sends SIGTERM before stopping a container.
process.on("SIGTERM", async () => {
	logger.info("SIGTERM received, closing server...")
	await fastify.close()
	logger.info("Server closed")
	process.exit(0)
})
