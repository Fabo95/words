import { Inngest } from "@/clients/inngest.js"
import { UserDailyGoalsModelService } from "@/services/model/userDailyGoalsModelService.js"
import { DailyStatisticsModelService } from "@/services/model/dailyStatisticsModelService.js"
import { TranslationsModelService } from "@/services/model/translationsModelService.js"
import { LearningProgressModelService } from "@/services/model/learningProgressModelService.js"

type InngestEntityCronFunctionsDeps = {
	inngest: Inngest
	userDailyGoalsModelService: UserDailyGoalsModelService
	dailyStatisticsModelService: DailyStatisticsModelService
	translationsModelService: TranslationsModelService
	learningProgressModelService: LearningProgressModelService
}

export const getEntityCronFunctions = ({
	inngest,
	userDailyGoalsModelService,
	dailyStatisticsModelService,
	translationsModelService,
	learningProgressModelService,
}: InngestEntityCronFunctionsDeps) => {
	/**
	 * Daily goals reset job - runs at midnight UTC
	 *
	 * This job:
	 * 1. Snapshots daily statistics BEFORE reset (for progress charts)
	 * 2. Resets words_added_today to 0
	 * 3. Updates last_reset_date to today
	 * 4. Resets current_streak to 0 if the goal was not met yesterday
	 */
	const dailyGoalsResetJob = inngest.createFunction(
		{ id: "daily-goals-reset-job" },
		{ cron: "0 0 * * *" },
		async ({ step }) => {
			const now = new Date()

			// Yesterday's date for the snapshot
			const yesterday = new Date(now)
			yesterday.setUTCDate(yesterday.getUTCDate() - 1)
			const yesterdayDate = new Date(
				Date.UTC(yesterday.getUTCFullYear(), yesterday.getUTCMonth(), yesterday.getUTCDate()),
			)

			// Yesterday at start of day (UTC) - goals completed before this should reset streak
			const yesterdayStart = new Date(now)
			yesterdayStart.setUTCDate(yesterdayStart.getUTCDate() - 1)
			yesterdayStart.setUTCHours(0, 0, 0, 0)

			// Step 1: Snapshot daily statistics BEFORE reset
			const snapshotCount = await step.run("snapshot-daily-statistics", async () => {
				// Fetch all user daily goals with their current stats
				const allUserGoals = await userDailyGoalsModelService.findMany({})

				if (allUserGoals.length === 0) {
					return 0
				}

				// Get user IDs
				const userIds = allUserGoals.map((goal) => goal.user_id)

				// Count translations per user
				const translationCounts = await translationsModelService.groupBy({
					by: ["user_id"],
					where: { user_id: { in: userIds } },
					_count: { id: true },
				})
				const translationCountMap = new Map(
					translationCounts.map((c) => [c.user_id, typeof c._count === "object" ? (c._count?.id ?? 0) : 0]),
				)

				// Count learning progress per user
				const learningCounts = await learningProgressModelService.groupBy({
					by: ["user_id"],
					where: { user_id: { in: userIds } },
					_count: { id: true },
				})

				const learningCountMap = new Map(
					learningCounts.map((c) => [c.user_id, typeof c._count === "object" ? (c._count?.id ?? 0) : 0]),
				)

				// Count mature items (interval >= 21 days is considered mature in spaced repetition)
				const matureCounts = await learningProgressModelService.groupBy({
					by: ["user_id"],
					where: {
						user_id: { in: userIds },
						interval: { gte: 21 },
					},
					_count: { id: true },
				})
				const matureCountMap = new Map(
					matureCounts.map((c) => [c.user_id, typeof c._count === "object" ? (c._count?.id ?? 0) : 0]),
				)

				// Build snapshot data for all users
				const snapshots = allUserGoals.map((goal) => ({
					user_id: goal.user_id,
					date: yesterdayDate,
					words_added: goal.words_added_today,
					daily_goal: goal.daily_add_words_goal,
					goal_completed: goal.words_added_today >= goal.daily_add_words_goal,
					streak_at_end_of_day: goal.current_streak,
					total_translations: translationCountMap.get(goal.user_id) ?? 0,
					learning_count: learningCountMap.get(goal.user_id) ?? 0,
					mature_count: matureCountMap.get(goal.user_id) ?? 0,
				}))

				const result = await dailyStatisticsModelService.createMany({ data: snapshots })
				return result.count
			})

			// Step 2: Reset words_added_today for all users
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

			// Step 3: Reset streaks for users who didn't complete their goal yesterday
			const streaksReset = await step.run("reset-stale-streaks", async () => {
				const result = await userDailyGoalsModelService.updateMany({
					where: {
						OR: [{ last_goal_completed_date: null }, { last_goal_completed_date: { lt: yesterdayStart } }],
					},
					data: {
						current_streak: 0,
						updated_at: now,
					},
				})
				return result.count
			})

			return { snapshotCount, totalReset: resetCount, streaksReset }
		},
	)

	return [dailyGoalsResetJob]
}
