"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useSuspenseQuery } from "@tanstack/react-query"
import { getDailyStatisticsQueryOptions } from "@app/utils/reactQuery/queryOptions"
import { TrendingUp } from "lucide-react"
import { Card } from "@app/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@app/components/ui/tabs"

type TimeRange = 7 | 30 | 90

function ProgressRing({ percentage, size = 80 }: { percentage: number; size?: number }) {
	const strokeWidth = 8
	const radius = (size - strokeWidth) / 2
	const circumference = radius * 2 * Math.PI
	const offset = circumference - (percentage / 100) * circumference

	return (
		<div className="relative flex-shrink-0" style={{ width: size, height: size }}>
			{/* biome-ignore lint/a11y/noSvgWithoutTitle: decorative element */}
			<svg width={size} height={size} className="-rotate-90">
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					strokeWidth={strokeWidth}
					style={{ stroke: "var(--border)" }}
				/>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					strokeWidth={strokeWidth}
					strokeDasharray={circumference}
					strokeDashoffset={offset}
					strokeLinecap="round"
					className="transition-all duration-500"
					style={{ stroke: "var(--primary)" }}
				/>
			</svg>
			<div className="absolute inset-0 flex items-center justify-center">
				<span className="text-base font-semibold tabular-nums">{Math.round(percentage)}%</span>
			</div>
		</div>
	)
}

export function ProgressChart() {
	const t = useTranslations()
	const [timeRange, setTimeRange] = useState<TimeRange>(7)

	const {
		data: { data },
	} = useSuspenseQuery(getDailyStatisticsQueryOptions({ days: timeRange }))

	const entries = data?.entries ?? []
	const summary = data?.summary

	if (entries.length === 0) {
		return (
			<section className="mb-8">
				<Card className="p-4 gap-0">
					<div className="flex items-center gap-2 mb-2">
						<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
							<TrendingUp className="h-4 w-4 text-primary" />
						</div>
						<h2 className="text-sm font-semibold">{t("pages.home.progressChart.title")}</h2>
					</div>
					<p className="text-sm text-muted-foreground">{t("pages.home.progressChart.emptyDescription")}</p>
				</Card>
			</section>
		)
	}

	const goalCompletionPercentage = summary ? (summary.days_goal_completed / timeRange) * 100 : 0

	return (
		<section className="mb-8">
			<Card className="p-4 gap-0">
				<div className="flex items-center gap-2 mb-3">
					<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
						<TrendingUp className="h-4 w-4 text-primary" />
					</div>
					<h2 className="text-sm font-semibold">{t("pages.home.progressChart.title")}</h2>
				</div>

				<Tabs
					value={timeRange.toString()}
					onValueChange={(v) => setTimeRange(Number(v) as TimeRange)}
					className="mb-4"
				>
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="7">{t("pages.home.progressChart.last7Days")}</TabsTrigger>
						<TabsTrigger value="30">{t("pages.home.progressChart.last30Days")}</TabsTrigger>
						<TabsTrigger value="90">{t("pages.home.progressChart.last90Days")}</TabsTrigger>
					</TabsList>
				</Tabs>

				{summary && (
					<div className="flex items-center gap-4">
						<ProgressRing percentage={goalCompletionPercentage} size={80} />
						<div className="flex-1 space-y-2">
							<div className="flex justify-between items-baseline">
								<span className="text-sm text-muted-foreground">{t("pages.home.progressChart.totalWords")}</span>
								<span className="text-base font-semibold tabular-nums">{summary.total_words_added}</span>
							</div>
							<div className="flex justify-between items-baseline">
								<span className="text-sm text-muted-foreground">{t("pages.home.progressChart.goalsCompleted")}</span>
								<span className="text-base font-semibold tabular-nums">
									{summary.days_goal_completed}/{timeRange}
								</span>
							</div>
							<div className="flex justify-between items-baseline">
								<span className="text-sm text-muted-foreground">{t("pages.home.progressChart.avgPerDay")}</span>
								<span className="text-base font-semibold tabular-nums">{summary.average_words_per_day.toFixed(1)}</span>
							</div>
						</div>
					</div>
				)}
			</Card>
		</section>
	)
}
