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
		{ cron: "0 0 * * *", tz: "Europe/Berlin" },
		async ({ step }) => {
			const today = new Date()
			today.setHours(0, 0, 0, 0)

			const yesterday = new Date(today)
			yesterday.setDate(yesterday.getDate() - 1)

			// Find all user daily goals that need to be reset
			const allDailyGoals = await step.run("fetch-daily-goals", async () => {
				return userDailyGoalsModelService.findMany()
			})

			// Process each user's daily goals
			const results = await step.run("reset-daily-goals", async () => {
				const updates = []

				for (const dailyGoal of allDailyGoals) {
					// Check if we need to reset the streak
					// Streak resets if the goal wasn't completed yesterday
					let newStreak = dailyGoal.current_streak

					if (dailyGoal.last_goal_completed_date) {
						const lastCompletedDate = new Date(dailyGoal.last_goal_completed_date)
						lastCompletedDate.setHours(0, 0, 0, 0)

						// If the goal was not completed yesterday or later, reset streak
						if (lastCompletedDate < yesterday) {
							newStreak = 0
						}
					} else {
						// No goal ever completed, streak should be 0
						newStreak = 0
					}

					// Update the daily goal
					await userDailyGoalsModelService.update(
						{ id: dailyGoal.id },
						{
							words_added_today: 0,
							last_reset_date: today,
							current_streak: newStreak,
							updated_at: new Date(),
						},
					)

					updates.push({
						userId: dailyGoal.user_id,
						previousStreak: dailyGoal.current_streak,
						newStreak,
						wasReset: newStreak !== dailyGoal.current_streak,
					})
				}

				return {
					totalProcessed: allDailyGoals.length,
					streaksReset: updates.filter((u) => u.wasReset).length,
				}
			})

			return results
		},
	)

	return [dailyGoalsResetJob]
}
