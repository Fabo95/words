import { Cradle, RequestCradle } from "@fastify/awilix"
import { NameAndRegistrationPair } from "awilix"
import { FastifyBaseLogger } from "fastify"

import { Inngest } from "@/clients/inngest.js"
import { PrismaClient } from "@/generated/user-db/client.js"
import { InngestFunctions } from "@/utils/inngest/functions/index.js"
import { TranslationsModelService } from "@/services/model/translationsModelService.js"

declare module "@fastify/awilix" {
	// get initialized when app starts
	interface Cradle {
		prisma: PrismaClient
	}

	// get initialized on request
	interface RequestCradle {
		inngestFunctions: InngestFunctions
		inngest: Inngest
		translationsModelService: TranslationsModelService
	}
}

export type CreateCradleFunc = () => Promise<Required<NameAndRegistrationPair<Cradle>>>
export type CreateRequestCradleFunc = (
	cradle: Cradle,
	reqLogger: FastifyBaseLogger,
) => Promise<Required<NameAndRegistrationPair<RequestCradle>>>
