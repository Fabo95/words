import { PrismaClient } from "@/generated/user-db/client.js"
import { learning_progressGroupByArgs } from "@/generated/user-db/models/learning_progress.js"

interface LearningProgressModelServiceDeps {
	prisma: PrismaClient
}

export class LearningProgressModelService {
	private readonly deps: LearningProgressModelServiceDeps

	constructor(deps: LearningProgressModelServiceDeps) {
		this.deps = deps
	}

	async groupBy(args: learning_progressGroupByArgs) {
		return this.deps.prisma.learning_progress.groupBy(args as Parameters<typeof this.deps.prisma.learning_progress.groupBy>[0])
	}
}
