import { I_ClientsFactory } from "@/setup/dependencies/factories/clientsFactory.js"
import { InngestFunctions, getInngestFunctions } from "@/utils/inngest/functions/index.js"

export interface InngestFunctionsFactoryDeps {
	clientsFactory: I_ClientsFactory
}

export interface I_InngestFunctionsFactory {
	getInngestFunctions: () => InngestFunctions
}

export class InngestFunctionsFactory implements I_InngestFunctionsFactory {
	private deps: InngestFunctionsFactoryDeps
	private inngestFunctions: InngestFunctions

	constructor(deps: InngestFunctionsFactoryDeps) {
		this.deps = deps
	}

	public getInngestFunctions() {
		if (!this.inngestFunctions) {
			this.inngestFunctions = getInngestFunctions({
				inngest: this.deps.clientsFactory.getInngest(),
			})
		}

		return this.inngestFunctions
	}
}
