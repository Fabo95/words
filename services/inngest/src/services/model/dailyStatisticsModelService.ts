import { PrismaClient } from "@/generated/user-db/client.js"
import {
	daily_statisticsCreateManyArgs,
} from "@/generated/user-db/models/daily_statistics.js"

interface DailyStatisticsModelServiceDeps {
	prisma: PrismaClient
}

export class DailyStatisticsModelService {
	private readonly deps: DailyStatisticsModelServiceDeps

	constructor(deps: DailyStatisticsModelServiceDeps) {
		this.deps = deps
	}

	async createMany(args: daily_statisticsCreateManyArgs) {
		return this.deps.prisma.daily_statistics.createMany({
			data: args.data,
			skipDuplicates: true,
		})
	}
}
