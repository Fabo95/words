import { PrismaClient } from "@/generated/user-db/client.js"
import {
	example_sentencesCreateArgs,
	example_sentencesFindFirstArgs,
	example_sentencesFindUniqueArgs,
	example_sentencesUpdateArgs,
} from "@/generated/user-db/models/example_sentences.js"

interface ExampleSentencesModelServiceDeps {
	prisma: PrismaClient
}

export class ExampleSentencesModelService {
	// dependencies
	private readonly deps: ExampleSentencesModelServiceDeps

	constructor(deps: ExampleSentencesModelServiceDeps) {
		this.deps = deps
	}

	async findUnique(where: example_sentencesFindUniqueArgs["where"]) {
		return this.deps.prisma.example_sentences.findUnique({
			where,
		})
	}

	async findFirst(where: example_sentencesFindFirstArgs["where"], orderBy?: example_sentencesFindFirstArgs["orderBy"]) {
		return this.deps.prisma.example_sentences.findFirst({
			where,
			orderBy,
		})
	}

	async create(data: example_sentencesCreateArgs["data"]) {
		return this.deps.prisma.example_sentences.create({
			data,
		})
	}

	async update(where: example_sentencesUpdateArgs["where"], data: example_sentencesUpdateArgs["data"]) {
		return this.deps.prisma.example_sentences.update({
			where,
			data,
		})
	}
}
