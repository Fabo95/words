import { getEntityCronFunctions } from "@/utils/inngest/functions/cronFunctions/entity/crons.js"
import { Inngest } from "@/clients/inngest.js"
import { UserDailyGoalsModelService } from "@/services/model/userDailyGoalsModelService.js"
import { DailyStatisticsModelService } from "@/services/model/dailyStatisticsModelService.js"
import { TranslationsModelService } from "@/services/model/translationsModelService.js"
import { LearningProgressModelService } from "@/services/model/learningProgressModelService.js"

type InngestCronFunctionsDeps = {
	inngest: Inngest
	userDailyGoalsModelService: UserDailyGoalsModelService
	dailyStatisticsModelService: DailyStatisticsModelService
	translationsModelService: TranslationsModelService
	learningProgressModelService: LearningProgressModelService
}

export const getInngestCronFunctions = ({
	inngest,
	userDailyGoalsModelService,
	dailyStatisticsModelService,
	translationsModelService,
	learningProgressModelService,
}: InngestCronFunctionsDeps) => [
	...getEntityCronFunctions({
		inngest,
		userDailyGoalsModelService,
		dailyStatisticsModelService,
		translationsModelService,
		learningProgressModelService,
	}),
]
