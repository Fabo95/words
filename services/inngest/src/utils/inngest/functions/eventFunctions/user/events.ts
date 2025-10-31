import { Inngest } from "@/clients/inngest.js"

type InngestEntityEventFunctionsDeps = {
	inngest: Inngest
}

export const getInngestEntityEventFunctions = ({ inngest }: InngestEntityEventFunctionsDeps) => {
	const userUpdated = inngest.createFunction({ id: "user-updated" }, { event: "user.updated" }, async () => {})

	return [userUpdated]
}
