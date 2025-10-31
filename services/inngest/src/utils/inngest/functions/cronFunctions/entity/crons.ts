import { Inngest } from "@/clients/inngest.js"

type InngestEntityCronFunctionsDeps = {
	inngest: Inngest
}

export const getEntityCronFunctions = ({ inngest }: InngestEntityCronFunctionsDeps) => {
	const _testerSubscriptionCleanupJob = inngest.createFunction(
		{ id: "tester-entity-cleanup-job" },
		{ cron: "0 1 * * *", tz: "Europe/Berlin" },
		async () => {},
	)

	return []
}
