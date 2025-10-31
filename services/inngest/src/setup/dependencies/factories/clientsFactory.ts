import { Inngest } from "@/clients/inngest.js"
import { FastifyBaseLogger } from "fastify"

interface ClientsFactoryDeps {
	logger: FastifyBaseLogger
}

export interface I_ClientsFactory {
	getInngest: () => Inngest
}

export interface Clients {
	inngest?: Inngest
}

export class ClientsFactory implements I_ClientsFactory {
	private deps: ClientsFactoryDeps
	private clients: Clients = {}

	constructor(deps: ClientsFactoryDeps) {
		this.deps = deps
	}

	public getInngest() {
		if (!this.clients.inngest) {
			this.clients.inngest = new Inngest()
		}
		return this.clients.inngest
	}
}
