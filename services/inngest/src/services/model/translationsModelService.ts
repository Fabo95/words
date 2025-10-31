import { PrismaClient } from "@/generated/user-db/client.js"
import {
	translationsCreateArgs,
	translationsFindFirstArgs,
	translationsFindUniqueArgs,
	translationsUpdateArgs,
} from "@/generated/user-db/models/translations.js"

interface TranslationsModelServiceDeps {
	prisma: PrismaClient
}

export class TranslationsModelService {
	// dependencies
	private readonly deps: TranslationsModelServiceDeps

	constructor(deps: TranslationsModelServiceDeps) {
		this.deps = deps
	}

	async findUnique(where: translationsFindUniqueArgs["where"]) {
		return this.deps.prisma.translations.findUnique({
			where,
		})
	}

	async findFirst(where: translationsFindFirstArgs["where"], orderBy?: translationsFindFirstArgs["orderBy"]) {
		return this.deps.prisma.translations.findFirst({
			where,
			orderBy,
		})
	}

	async create(data: translationsCreateArgs["data"]) {
		return this.deps.prisma.translations.create({
			data,
		})
	}

	async update(where: translationsUpdateArgs["where"], data: translationsUpdateArgs["data"]) {
		return this.deps.prisma.translations.update({
			where,
			data,
		})
	}
}
