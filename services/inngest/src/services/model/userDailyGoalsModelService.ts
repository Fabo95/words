import { PrismaClient } from "@/generated/user-db/client.js"
import {
	user_daily_goalsFindManyArgs,
	user_daily_goalsUpdateArgs,
} from "@/generated/user-db/models/user_daily_goals.js"

interface UserDailyGoalsModelServiceDeps {
	prisma: PrismaClient
}

export class UserDailyGoalsModelService {
	private readonly deps: UserDailyGoalsModelServiceDeps

	constructor(deps: UserDailyGoalsModelServiceDeps) {
		this.deps = deps
	}

	async findMany(args?: {
		where?: user_daily_goalsFindManyArgs["where"]
		orderBy?: user_daily_goalsFindManyArgs["orderBy"]
	}) {
		return this.deps.prisma.user_daily_goals.findMany({
			where: args?.where,
			orderBy: args?.orderBy,
		})
	}

	async update(where: user_daily_goalsUpdateArgs["where"], data: user_daily_goalsUpdateArgs["data"]) {
		return this.deps.prisma.user_daily_goals.update({
			where,
			data,
		})
	}

	async updateMany(args: { where: user_daily_goalsFindManyArgs["where"]; data: user_daily_goalsUpdateArgs["data"] }) {
		return this.deps.prisma.user_daily_goals.updateMany({
			where: args.where,
			data: args.data,
		})
	}
}
