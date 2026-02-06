"use client"

import { useTranslations } from "next-intl"
import { Button } from "@app/components/ui/button"
import { Card, CardContent } from "@app/components/ui/card"
import { Clock, Sparkles, BookOpen, Award } from "lucide-react"
import { cn } from "@app/utils/shadcn/shadcnHelpers"

type LearnStats = {
	due_count: number
	new_count: number
	learning_count: number
	mature_count: number
}

type LearningLandingProps = {
	stats: LearnStats | undefined
	onStartLearning: () => void
	isLoading: boolean
	reverseMode: boolean
	onReverseModeChange: (value: boolean) => void
}

export function LearningLanding({
	stats,
	onStartLearning,
	isLoading,
	reverseMode,
	onReverseModeChange,
}: LearningLandingProps) {
	const t = useTranslations()

	const statItems = [
		{
			label: t("pages.learning.stats.due"),
			value: stats?.due_count ?? 0,
			icon: Clock,
			highlight: true,
		},
		{
			label: t("pages.learning.stats.new"),
			value: stats?.new_count ?? 0,
			icon: Sparkles,
			highlight: true,
		},
		{
			label: t("pages.learning.stats.learning"),
			value: stats?.learning_count ?? 0,
			icon: BookOpen,
			highlight: false,
		},
		{
			label: t("pages.learning.stats.mature"),
			value: stats?.mature_count ?? 0,
			icon: Award,
			highlight: false,
		},
	]

	return (
		<div className="mx-auto w-full max-w-lg">
			<div className="text-center mb-8">
				<h1 className="text-lg md:text-xl font-semibold tracking-tight mb-2">{t("pages.learning.landing.title")}</h1>
				<p className="text-sm text-muted-foreground">{t("pages.learning.landing.description")}</p>
			</div>

			<div className="grid grid-cols-2 gap-3 mb-8">
				{statItems.map((item) => {
					const Icon = item.icon
					return (
						<Card key={item.label} className="overflow-hidden">
							<CardContent className="p-4">
								<div className="flex items-center gap-3">
									<div
										className={`flex h-10 w-10 items-center justify-center rounded-full ${
											item.highlight ? "bg-primary/10" : "bg-muted"
										}`}
									>
										<Icon className={`h-5 w-5 ${item.highlight ? "text-primary" : "text-foreground/60"}`} />
									</div>
									<div>
										<p
											className={`text-2xl font-semibold tabular-nums ${
												item.highlight ? "text-foreground" : "text-foreground/70"
											}`}
										>
											{item.value}
										</p>
										<p className="text-xs text-foreground/50">{item.label}</p>
									</div>
								</div>
							</CardContent>
						</Card>
					)
				})}
			</div>

			{/* Direction toggle */}
			<div className="mb-4">
				<div className="flex rounded-lg border bg-muted/50 p-1">
					<button
						type="button"
						onClick={() => onReverseModeChange(false)}
						className={cn(
							"flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
							!reverseMode ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground",
						)}
					>
						{t("pages.learning.landing.directionNormal")}
					</button>
					<button
						type="button"
						onClick={() => onReverseModeChange(true)}
						className={cn(
							"flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
							reverseMode ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground",
						)}
					>
						{t("pages.learning.landing.directionReverse")}
					</button>
				</div>
			</div>

			<Button className="w-full text-base" onClick={onStartLearning} isLoading={isLoading}>
				{t("pages.learning.landing.startButton")}
			</Button>
		</div>
	)
}
