import { PrismaClient } from "@/generated/user-db/client.js"
import {
	translations_universal_pos_tagsCreateArgs,
	translations_universal_pos_tagsDeleteArgs,
	translations_universal_pos_tagsFindManyArgs,
	translations_universal_pos_tagsFindUniqueArgs,
} from "@/generated/user-db/models/translations_universal_pos_tags.js"

interface TranslationsUniversalPosTagsModelServiceDeps {
	prisma: PrismaClient
}

export class TranslationsUniversalPosTagsModelService {
	private readonly deps: TranslationsUniversalPosTagsModelServiceDeps

	constructor(deps: TranslationsUniversalPosTagsModelServiceDeps) {
		this.deps = deps
	}

	async findUnique(where: translations_universal_pos_tagsFindUniqueArgs["where"]) {
		return this.deps.prisma.translations_universal_pos_tags.findUnique({ where })
	}

	async findMany(where?: translations_universal_pos_tagsFindManyArgs["where"]) {
		return this.deps.prisma.translations_universal_pos_tags.findMany({ where })
	}

	async create(data: translations_universal_pos_tagsCreateArgs["data"]) {
		return this.deps.prisma.translations_universal_pos_tags.create({ data })
	}

	async delete(where: translations_universal_pos_tagsDeleteArgs["where"]) {
		return this.deps.prisma.translations_universal_pos_tags.delete({ where })
	}
}
