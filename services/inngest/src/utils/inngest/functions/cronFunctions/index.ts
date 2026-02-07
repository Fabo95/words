import { getEntityCronFunctions } from "@/utils/inngest/functions/cronFunctions/entity/crons.js"
import { Inngest } from "@/clients/inngest.js"
import { UserDailyGoalsModelService } from "@/services/model/userDailyGoalsModelService.js"

type InngestCronFunctionsDeps = {
	inngest: Inngest
	userDailyGoalsModelService: UserDailyGoalsModelService
}

export const getInngestCronFunctions = ({ inngest, userDailyGoalsModelService }: InngestCronFunctionsDeps) => [
	...getEntityCronFunctions({
		inngest,
		userDailyGoalsModelService,
	}),
]
