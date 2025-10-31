import { FastifyBaseLogger } from "fastify"

interface CommonServicesFactoryDeps {
	logger: FastifyBaseLogger
}

export class CommonServicesFactory {
	private deps: CommonServicesFactoryDeps
	private commonServices = {}

	constructor(deps: CommonServicesFactoryDeps) {
		this.deps = deps
	}
}
