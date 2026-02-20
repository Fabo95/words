"use client"

import { useTranslations } from "next-intl"
import { Button } from "@app/components/ui/button"
import { Card, CardContent } from "@app/components/ui/card"
import { Switch } from "@app/components/ui/switch"
import { Label } from "@app/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@app/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@app/components/ui/tooltip"
import { Clock, Sparkles, BookOpen, Award } from "lucide-react"

type LearnStats = {
	due_count: number
	new_count: number
	learning_count: number
	mature_count: number
}

type Collection = {
	id: number
	name: string
}

type LearningLandingProps = {
	stats: LearnStats | undefined
	isStatsLoading: boolean
	collections: Collection[]
	selectedCollectionId: number | null
	onCollectionChange: (collectionId: number | null) => void
	onStartLearning: () => void
	isLoading: boolean
	reverseMode: boolean
	onReverseModeChange: (value: boolean) => void
}

export function LearningLanding({
	stats,
	isStatsLoading,
	collections,
	selectedCollectionId,
	onCollectionChange,
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

	const hasNoItemsToLearn = !isStatsLoading && (stats?.due_count ?? 0) + (stats?.new_count ?? 0) === 0

	return (
		<div className="mx-auto w-full max-w-lg">
			<div className="text-center mb-8">
				<h1 className="text-lg md:text-xl font-semibold tracking-tight mb-2">{t("pages.learning.landing.title")}</h1>
				<p className="text-sm text-muted-foreground">{t("pages.learning.landing.description")}</p>
			</div>

			<Select
				value={selectedCollectionId?.toString() ?? "all"}
				onValueChange={(value) => onCollectionChange(value === "all" ? null : Number(value))}
			>
				<SelectTrigger id="collection-select" className="mb-5">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">{t("pages.learning.landing.allCollections")}</SelectItem>
					{collections.map((collection) => (
						<SelectItem key={collection.id} value={collection.id.toString()}>
							{collection.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<div className="grid grid-cols-2 gap-2 md:gap-3 mb-6 md:mb-8">
				{statItems.map((item) => {
					const Icon = item.icon
					return (
						<Card key={item.label} className="overflow-hidden">
							<CardContent className="p-3 md:p-4">
								<div className="flex items-center gap-2 md:gap-3">
									<div
										className={`flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full ${
											item.highlight ? "bg-primary/10" : "bg-muted"
										}`}
									>
										<Icon className={`h-4 w-4 md:h-5 md:w-5 ${item.highlight ? "text-primary" : "text-foreground/60"}`} />
									</div>
									<div>
										<p
											className={`text-lg md:text-xl font-semibold tabular-nums ${
												item.highlight ? "text-foreground" : "text-foreground/70"
											}`}
										>
											{isStatsLoading ? (
												<span className="inline-block w-8 h-5.5 bg-muted animate-pulse rounded" />
											) : (
												item.value
											)}
										</p>
										<p className="text-xs text-foreground/50">{item.label}</p>
									</div>
								</div>
							</CardContent>
						</Card>
					)
				})}
			</div>
			<div className="mb-4 rounded-lg border bg-card p-3">
				<div className="flex items-center justify-between">
					<div>
						<Label htmlFor="reverse-mode" className="text-sm font-medium cursor-pointer">
							{reverseMode ? t("pages.learning.landing.directionReverse") : t("pages.learning.landing.directionNormal")}
						</Label>
						<p className="text-xs text-muted-foreground">
							{reverseMode
								? t("pages.learning.landing.directionReverseHint")
								: t("pages.learning.landing.directionNormalHint")}
						</p>
					</div>
					<Switch id="reverse-mode" checked={reverseMode} onCheckedChange={onReverseModeChange} />
				</div>
			</div>

			<Tooltip>
				<TooltipTrigger asChild>
					<span className="w-full">
						<Button
							className="w-full text-base"
							onClick={onStartLearning}
							isLoading={isLoading}
							disabled={hasNoItemsToLearn}
						>
							{t("pages.learning.landing.startButton")}
						</Button>
					</span>
				</TooltipTrigger>

				{hasNoItemsToLearn && (
					<TooltipContent>
						<p>{t("pages.learning.landing.noItemsTooltip")}</p>
					</TooltipContent>
				)}
			</Tooltip>
		</div>
	)
}
