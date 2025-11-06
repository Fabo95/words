import { PrismaClient } from "@/generated/user-db/client.js"
import {
    universal_pos_tagsFindUniqueArgs,
    universal_pos_tagsFindManyArgs,
} from "@/generated/user-db/models/universal_pos_tags.js"

interface UniversalPosTagsModelServiceDeps {
    prisma: PrismaClient
}

export class UniversalPosTagsModelService {
    private readonly deps: UniversalPosTagsModelServiceDeps

    constructor(deps: UniversalPosTagsModelServiceDeps) {
        this.deps = deps
    }

    async findUnique(where: universal_pos_tagsFindUniqueArgs["where"]) {
        return this.deps.prisma.universal_pos_tags.findUnique({ where })
    }

    async findMany(where?: universal_pos_tagsFindManyArgs["where"]) {
        return this.deps.prisma.universal_pos_tags.findMany({ where })
    }
}
