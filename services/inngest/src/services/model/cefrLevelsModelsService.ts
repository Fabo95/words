import { PrismaClient } from "@/generated/user-db/client.js"
import {
	cefr_levelsCreateArgs,
	cefr_levelsFindFirstArgs,
	cefr_levelsFindUniqueArgs,
	cefr_levelsUpdateArgs,
} from "@/generated/user-db/models/cefr_levels.js"

interface CefrLevelsModelServiceDeps {
	prisma: PrismaClient
}

export class CefrLevelsModelService {
	private readonly deps: CefrLevelsModelServiceDeps

	constructor(deps: CefrLevelsModelServiceDeps) {
		this.deps = deps
	}

	async findUnique(where: cefr_levelsFindUniqueArgs["where"]) {
		return this.deps.prisma.cefr_levels.findUnique({
			where,
		})
	}

	async findFirst(where: cefr_levelsFindFirstArgs["where"], orderBy?: cefr_levelsFindFirstArgs["orderBy"]) {
		return this.deps.prisma.cefr_levels.findFirst({
			where,
			orderBy,
		})
	}

	async create(data: cefr_levelsCreateArgs["data"]) {
		return this.deps.prisma.cefr_levels.create({
			data,
		})
	}

	async update(where: cefr_levelsUpdateArgs["where"], data: cefr_levelsUpdateArgs["data"]) {
		return this.deps.prisma.cefr_levels.update({
			where,
			data,
		})
	}
}
