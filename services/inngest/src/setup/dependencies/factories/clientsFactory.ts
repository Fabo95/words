import { Inngest } from "@/clients/inngest.js"
import { FastifyBaseLogger } from "fastify"
import { OpenAi } from "@/clients/openAi.js"

interface ClientsFactoryDeps {
	logger: FastifyBaseLogger
}

export interface I_ClientsFactory {
	getInngest: () => Inngest
	getOpenAi: () => OpenAi
}

export interface Clients {
	inngest?: Inngest
	openAi?: OpenAi
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

	public getOpenAi() {
		if (!this.clients.openAi) {
			this.clients.openAi = new OpenAi()
		}
		return this.clients.openAi
	}
}
