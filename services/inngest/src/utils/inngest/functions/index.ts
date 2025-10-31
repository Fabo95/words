import { Inngest } from "@/clients/inngest.js"
import { getInngestCronFunctions } from "@/utils/inngest/functions/cronFunctions/index.js"
import { getInngestEventFunctions } from "@/utils/inngest/functions/eventFunctions/index.js"

export type InngestFunctions = ReturnType<typeof getInngestFunctions>

type InngestFunctionsDeps = {
	inngest: Inngest
}

export const getInngestFunctions = ({ inngest }: InngestFunctionsDeps) => [
	...getInngestEventFunctions({
		inngest,
	}),
	...getInngestCronFunctions({
		inngest,
	}),
]
