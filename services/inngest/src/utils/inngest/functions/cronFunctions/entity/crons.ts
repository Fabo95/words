import { Inngest } from "@/clients/inngest.js"
import { UserDailyGoalsModelService } from "@/services/model/userDailyGoalsModelService.js"

type InngestEntityCronFunctionsDeps = {
	inngest: Inngest
	userDailyGoalsModelService: UserDailyGoalsModelService
}

export const getEntityCronFunctions = ({ inngest, userDailyGoalsModelService }: InngestEntityCronFunctionsDeps) => {
	/**
	 * Daily goals reset job - runs at midnight Europe/Berlin time
	 *
	 * This job resets the daily word counters for all users and handles streak logic:
	 * - Resets words_added_today to 0
	 * - Updates last_reset_date to today
	 * - Resets current_streak to 0 if the goal was not met yesterday
	 */
	const dailyGoalsResetJob = inngest.createFunction(
		{ id: "daily-goals-reset-job" },
		{ cron: "0 0 * * *" },
		async ({ step }) => {
			const now = new Date()

			// Yesterday at start of day (UTC) - goals completed before this should reset streak
			const yesterdayStart = new Date(now)
			yesterdayStart.setUTCDate(yesterdayStart.getUTCDate() - 1)
			yesterdayStart.setUTCHours(0, 0, 0, 0)

			// Reset words_added_today for all users
			const resetCount = await step.run("reset-words-count", async () => {
				const result = await userDailyGoalsModelService.updateMany({
					data: {
						words_added_today: 0,
						last_reset_date: now,
						updated_at: now,
					},
				})
				return result.count
			})

			// Reset streaks for users who didn't complete their goal yesterday
			const streaksReset = await step.run("reset-stale-streaks", async () => {
				const result = await userDailyGoalsModelService.updateMany({
					where: {
						OR: [
							{ last_goal_completed_date: null },
							{ last_goal_completed_date: { lt: yesterdayStart } },
						],
					},
					data: {
						current_streak: 0,
						updated_at: now,
					},
				})
				return result.count
			})

			return { totalReset: resetCount, streaksReset }
		},
	)

	return [dailyGoalsResetJob]
}
