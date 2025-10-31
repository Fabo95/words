import { getEntityCronFunctions } from "@/utils/inngest/functions/cronFunctions/entity/crons.js"
import { Inngest } from "@/clients/inngest.js"

type InngestCronFunctionsDeps = {
	inngest: Inngest
}

export const getInngestCronFunctions = ({ inngest }: InngestCronFunctionsDeps) => [
	...getEntityCronFunctions({
		inngest,
	}),
]
