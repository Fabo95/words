"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@app/components/ui/button"
import { ProgressRing } from "@app/components/ui/progress-ring"
import {
	DialogOrDrawer,
	DialogOrDrawerContent,
	DialogOrDrawerDescription,
	DialogOrDrawerHeader,
	DialogOrDrawerTitle,
	DialogOrDrawerFooter,
} from "@app/components/ui/dialogOrDrawer"
import { Tooltip, TooltipContent, TooltipTrigger } from "@app/components/ui/tooltip"
import { Input } from "@app/components/ui/input"
import { Label } from "@app/components/ui/label"
import { getDailyGoalsQueryOptions } from "@app/utils/reactQuery/queryOptions"
import { $api } from "@app/utils/api/apiRequests"
import { useToast } from "@app/components/ui/use-toast"
import { Flame } from "lucide-react"

const dailyGoalSchema = z.object({
	daily_add_words_goal: z.coerce.number().min(1).max(100),
})

type DailyGoalFormValues = z.infer<typeof dailyGoalSchema>

export function DailyGoalsIndicator() {
	const t = useTranslations("components.dailyGoals")
	const { toast } = useToast()
	const queryClient = useQueryClient()
	const [isOpen, setIsOpen] = useState(false)

	const { data } = useSuspenseQuery(getDailyGoalsQueryOptions())
	const dailyGoals = data.data

	const updateMutation = $api.useMutation("patch", "/daily-goals", {
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: getDailyGoalsQueryOptions().queryKey })
			toast({
				title: t("toast.success.title"),
				description: t("toast.success.description"),
			})
		},
		onError: () => {
			toast({
				title: t("toast.error.title"),
				description: t("toast.error.description"),
			})
		},
	})

	const form = useForm<DailyGoalFormValues>({
		resolver: zodResolver(dailyGoalSchema),
		defaultValues: {
			daily_add_words_goal: dailyGoals?.daily_add_words_goal ?? 5,
		},
	})

	const onSubmit = (values: DailyGoalFormValues) => {
		updateMutation.mutate({
			body: {
				daily_add_words_goal: values.daily_add_words_goal,
			},
		})
	}

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
									<p className="text-2xl font-bold">
										{words_added_today}/{daily_add_words_goal}
									</p>
									<p className="text-sm text-muted-foreground">{t("wordsToday")}</p>
								</div>
							</div>
							<div className="w-full bg-muted rounded-full h-2">
								<div
									className="bg-primary h-2 rounded-full transition-all duration-300"
									style={{ width: `${Math.min(100, progress_percentage)}%` }}
								/>
							</div>
							<p className="text-sm text-muted-foreground text-right">
								{Math.round(progress_percentage)}%
							</p>
						</div>

						{/* Streaks Section */}
						<div className="space-y-3">
							<h4 className="text-sm font-medium">{t("streaksTitle")}</h4>
							<div className="grid grid-cols-2 gap-4">
								<div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
									<Flame className="h-5 w-5 text-orange-500 fill-orange-500" />
									<div>
										<p className="text-lg font-bold">{current_streak}</p>
										<p className="text-xs text-muted-foreground">{t("currentStreak")}</p>
									</div>
								</div>
								<div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
									<Flame className="h-5 w-5 text-muted-foreground" />
									<div>
										<p className="text-lg font-bold">{longest_streak}</p>
										<p className="text-xs text-muted-foreground">{t("longestStreak")}</p>
									</div>
								</div>
							</div>
						</div>

						{/* Settings Section */}
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
							<h4 className="text-sm font-medium">{t("settingsTitle")}</h4>
							<div className="space-y-2">
								<Label htmlFor="daily_add_words_goal">{t("goalLabel")}</Label>
								<Input
									id="daily_add_words_goal"
									type="number"
									min={1}
									max={100}
									{...form.register("daily_add_words_goal")}
								/>
								{form.formState.errors.daily_add_words_goal && (
									<p className="text-sm text-destructive">{t("goalError")}</p>
								)}
							</div>
							<DialogOrDrawerFooter>
								<Button type="submit" isLoading={updateMutation.isPending}>
									{t("saveButton")}
								</Button>
							</DialogOrDrawerFooter>
						</form>
					</div>
				</DialogOrDrawerContent>
			</DialogOrDrawer>
		</>
	)
}
