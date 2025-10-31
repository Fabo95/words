import { env } from "@/env.js"
import { InngestEvents } from "@/utils/inngest/types/index.js"
import { EventSchemas, GetEvents, Inngest as InngestClient, SendEventPayload } from "inngest"

export type InngestEventPayload = SendEventPayload<GetEvents<TypedInngestClient>>

export class Inngest {
	readonly inngest: TypedInngestClient
	readonly createFunction: TypedInngestClient["createFunction"]

	constructor() {
		this.inngest = createInngestClient()

		this.createFunction = this.inngest.createFunction.bind(this.inngest)
	}

	async send(data: InngestEventPayload): Promise<void> {
		await this.inngest.send(data)
	}
}

export type TypedInngestClient = ReturnType<typeof createInngestClient>
// for typing
function createInngestClient() {
	return new InngestClient({
		id: "inngest-api",
		isDev: env.INNGEST_DEV === "1",
		schemas: new EventSchemas().fromRecord<InngestEvents>(),
	})
}
