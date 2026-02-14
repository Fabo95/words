"use client"

import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useSuspenseQuery } from "@tanstack/react-query"
import { getDailyStatisticsQueryOptions } from "@app/utils/reactQuery/queryOptions"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { TrendingUp } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@app/components/ui/tabs"

type TimeRange = 7 | 30 | 90

export function ProgressChart() {
	const t = useTranslations()
	const locale = useLocale()
	const [timeRange, setTimeRange] = useState<TimeRange>(7)

	const {
		data: { data },
	} = useSuspenseQuery(getDailyStatisticsQueryOptions({ days: timeRange }))

	const entries = data?.entries ?? []
	const summary = data?.summary

	if (entries.length === 0) {
		return (
			<section className="mb-12">
				<div className="mb-5 text-center">
					<div className="flex justify-center mb-3">
						<div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-primary/10">
							<TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-primary" />
						</div>
					</div>
					<h2 className="text-lg md:text-xl font-semibold">{t("pages.home.progressChart.title")}</h2>
					<p className="mt-1 text-sm text-foreground/40">{t("pages.home.progressChart.emptyDescription")}</p>
				</div>
			</section>
		)
	}

	const chartData = entries.map((entry) => ({
		date: new Date(entry.date).toLocaleDateString(locale, {
			month: "short",
			day: "numeric",
		}),
		wordsAdded: entry.words_added,
		goal: entry.daily_goal,
		goalCompleted: entry.goal_completed,
	}))

	return (
		<section className="mb-12">
			<div className="mb-5 text-center">
				<div className="flex justify-center mb-3">
					<div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-primary/10">
						<TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-primary" />
					</div>
				</div>
				<h2 className="text-lg md:text-xl font-semibold">{t("pages.home.progressChart.title")}</h2>
				<p className="mt-1 text-sm text-foreground/40">{t("pages.home.progressChart.description")}</p>
			</div>

			<div className="mx-auto max-w-2xl overflow-hidden rounded-xl border bg-background/40">
				<div className="px-4 py-4">
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

					<div className="h-48 w-full">
						<ResponsiveContainer width="100%" height="100%">
							<AreaChart data={chartData}>
								<defs>
									<linearGradient id="colorWords" x1="0" y1="0" x2="0" y2="1">
										<stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
										<stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
									</linearGradient>
								</defs>
								<XAxis
									dataKey="date"
									tick={{ fontSize: 12 }}
									tickLine={false}
									axisLine={false}
									interval="preserveStartEnd"
								/>
								<YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} width={30} />
								<Tooltip
									contentStyle={{
										backgroundColor: "hsl(var(--background))",
										border: "1px solid hsl(var(--border))",
										borderRadius: "8px",
									}}
									formatter={(value) => [value, t("pages.home.progressChart.wordsAdded")]}
								/>
								<Area
									type="monotone"
									dataKey="wordsAdded"
									stroke="hsl(var(--primary))"
									fillOpacity={1}
									fill="url(#colorWords)"
								/>
							</AreaChart>
						</ResponsiveContainer>
					</div>

					{summary && (
						<div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
							<div className="text-center">
								<p className="text-2xl font-bold tabular-nums">{summary.total_words_added}</p>
								<p className="text-xs text-muted-foreground">{t("pages.home.progressChart.totalWords")}</p>
							</div>
							<div className="text-center">
								<p className="text-2xl font-bold tabular-nums">{summary.days_goal_completed}</p>
								<p className="text-xs text-muted-foreground">{t("pages.home.progressChart.goalsCompleted")}</p>
							</div>
							<div className="text-center">
								<p className="text-2xl font-bold tabular-nums">{summary.average_words_per_day.toFixed(1)}</p>
								<p className="text-xs text-muted-foreground">{t("pages.home.progressChart.avgPerDay")}</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	)
}
