"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useSuspenseQuery } from "@tanstack/react-query"

import { Button } from "@app/components/ui/button"
import { ProgressRing } from "@app/components/ui/progress-ring"
import {
	DialogOrDrawer,
	DialogOrDrawerContent,
	DialogOrDrawerDescription,
	DialogOrDrawerFooter,
	DialogOrDrawerHeader,
	DialogOrDrawerTitle,
} from "@app/components/ui/dialogOrDrawer"
import { Tooltip, TooltipContent, TooltipTrigger } from "@app/components/ui/tooltip"
import { getDailyGoalsQueryOptions } from "@app/utils/reactQuery/queryOptions"
import { Flame } from "lucide-react"
import { DailyGoalsForm } from "@app/components/forms/dailyGoalsForm/dailyGoalsForm"

export function DailyGoalsIndicator() {
	const t = useTranslations("components.dailyGoals")
	const [isOpen, setIsOpen] = useState(false)

	const { data } = useSuspenseQuery(getDailyGoalsQueryOptions())
	const dailyGoals = data.data

	if (!dailyGoals) return null

	const { words_added_today, daily_add_words_goal, progress_percentage, current_streak, longest_streak } = dailyGoals

	return (
		<>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="h-9 w-9 md:h-7 md:w-7 relative"
						onClick={() => setIsOpen(true)}
					>
						<ProgressRing value={progress_percentage} size={20} strokeWidth={2.5} />
						{current_streak > 0 && (
							<Flame className="h-2.5 w-2.5 absolute -top-0.5 -right-0.5 text-orange-500 fill-orange-500" />
						)}
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>
						{t("tooltip", { current: words_added_today, goal: daily_add_words_goal })}
						{current_streak > 0 && ` | ${t("tooltipStreak", { days: current_streak })}`}
					</p>
				</TooltipContent>
			</Tooltip>

			<DialogOrDrawer open={isOpen} onOpenChange={setIsOpen}>
				<DialogOrDrawerContent>
					<DialogOrDrawerHeader>
						<DialogOrDrawerTitle>{t("title")}</DialogOrDrawerTitle>
						<DialogOrDrawerDescription>{t("description")}</DialogOrDrawerDescription>
					</DialogOrDrawerHeader>

					<div className="space-y-6 p-4 md:p-0">
						{/* Progress Section */}
						<div className="space-y-3">
							<h4 className="text-sm font-medium">{t("progressTitle")}</h4>
							<div className="flex items-center gap-4">
								<ProgressRing value={progress_percentage} size={48} strokeWidth={4} />
								<div>
									<p className="text-xl font-semibold">
										{words_added_today}/{daily_add_words_goal}
									</p>
									<p className="text-sm text-muted-foreground">{t("wordsAdded")}</p>
								</div>
							</div>
							<div className="w-full bg-muted rounded-full h-2">
								<div
									className="bg-primary h-2 rounded-full transition-all duration-300"
									style={{ width: `${Math.min(100, progress_percentage)}%` }}
								/>
							</div>
							<p className="text-sm text-muted-foreground text-right">{Math.round(progress_percentage)}%</p>
						</div>

						{/* Streaks Section */}
						<div className="space-y-3">
							<h4 className="text-sm font-medium">{t("streaksTitle")}</h4>
							<div className="grid grid-cols-2 gap-4">
								<div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
									<Flame className="h-5 w-5 text-orange-500 fill-orange-500" />
									<div>
										<p className="text-base font-semibold">{current_streak}</p>
										<p className="text-xs text-muted-foreground">{t("currentStreak")}</p>
									</div>
								</div>
								<div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
									<Flame className="h-5 w-5 text-muted-foreground" />
									<div>
										<p className="text-base font-semibold">{longest_streak}</p>
										<p className="text-xs text-muted-foreground">{t("longestStreak")}</p>
									</div>
								</div>
							</div>
						</div>

						<DailyGoalsForm defaultValues={{ daily_add_words_goal }} />
					</div>
				</DialogOrDrawerContent>
			</DialogOrDrawer>
		</>
	)
}
