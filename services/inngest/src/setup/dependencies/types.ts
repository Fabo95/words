import { Cradle, RequestCradle } from "@fastify/awilix"
import { NameAndRegistrationPair } from "awilix"
import { FastifyBaseLogger } from "fastify"

import { Inngest } from "@/clients/inngest.js"
import { PrismaClient } from "@/generated/user-db/client.js"
import { InngestFunctions } from "@/utils/inngest/functions/index.js"
import { TranslationsModelService } from "@/services/model/translationsModelService.js"
import { OpenAi } from "@/clients/openAi.js"
import { ExampleSentencesModelService } from "@/services/model/exampleSentencesModelService.js"

declare module "@fastify/awilix" {
	// get initialized when app starts
	interface Cradle {
		prisma: PrismaClient
	}

	// get initialized on request
	interface RequestCradle {
		// clients
		inngest: Inngest
		openAi: OpenAi

		inngestFunctions: InngestFunctions

		// models
		translationsModelService: TranslationsModelService
		exampleSentencesModelService: ExampleSentencesModelService
	}
}

export type CreateCradleFunc = () => Promise<Required<NameAndRegistrationPair<Cradle>>>
export type CreateRequestCradleFunc = (
	cradle: Cradle,
	reqLogger: FastifyBaseLogger,
) => Promise<Required<NameAndRegistrationPair<RequestCradle>>>
