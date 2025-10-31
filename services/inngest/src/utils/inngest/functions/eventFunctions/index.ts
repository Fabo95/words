import { Inngest } from "@/clients/inngest.js"
import { getInngestEntityEventFunctions } from "@/utils/inngest/functions/eventFunctions/user/events.js"

type InngestEventFunctionsDeps = {
	inngest: Inngest
}

export const getInngestEventFunctions = ({ inngest }: InngestEventFunctionsDeps) => [
	...getInngestEntityEventFunctions({
		inngest,
	}),
]
