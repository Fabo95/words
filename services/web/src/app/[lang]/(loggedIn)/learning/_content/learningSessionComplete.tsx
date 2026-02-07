"use client"

import { useTranslations } from "next-intl"
import { Button } from "@app/components/ui/button"
import { Card, CardContent } from "@app/components/ui/card"
import { X, Minus, Check, Trophy } from "lucide-react"
import { cn } from "@app/utils/shadcn/shadcnHelpers"
import type { ReviewGrade } from "./utils/useLearningSessionQuery"

type ReviewResult = {
	translationId: number
	grade: ReviewGrade
}

type LearningSessionCompleteProps = {
	results: ReviewResult[]
	totalItems: number
	onContinue: () => void
	onFinish: () => void
}

const gradeConfig: Record<ReviewGrade, { icon: typeof X; colorClass: string; bgClass: string }> = {
	again: { icon: X, colorClass: "text-red-500", bgClass: "bg-red-500/10" },
	hard: { icon: Minus, colorClass: "text-muted-foreground", bgClass: "bg-muted" },
	good: { icon: Check, colorClass: "text-green-500", bgClass: "bg-green-500/10" },
	easy: { icon: Check, colorClass: "text-green-600", bgClass: "bg-green-500/10" },
}

export function LearningSessionComplete({ results, totalItems, onContinue, onFinish }: LearningSessionCompleteProps) {
	const t = useTranslations()

	const gradeCounts: Record<ReviewGrade, number> = {
		again: results.filter((r) => r.grade === "again").length,
		hard: results.filter((r) => r.grade === "hard").length,
		good: results.filter((r) => r.grade === "good").length,
		easy: results.filter((r) => r.grade === "easy").length,
	}

	const grades: ReviewGrade[] = ["again", "hard", "good", "easy"]

	return (
		<div className="mx-auto w-full max-w-lg">
			<div className="text-center mb-8">
				<div className="flex justify-center mb-4">
					<div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
						<Trophy className="h-6 w-6 text-primary" />
					</div>
				</div>
				<h1 className="text-lg md:text-xl font-semibold">{t("pages.learning.complete.title")}</h1>
				<p className="text-sm text-muted-foreground">{t("pages.learning.complete.summary", { total: totalItems })}</p>
			</div>

			<div className="grid grid-cols-2 gap-2 mb-6 md:mb-8">
				{grades.map((grade) => {
					const config = gradeConfig[grade]
					const Icon = config.icon
					return (
						<Card key={grade}>
							<CardContent className="p-2 md:p-3 text-center">
								<div
									className={cn("mx-auto mb-1.5 md:mb-2 flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full", config.bgClass)}
								>
									<Icon className={cn("h-3.5 w-3.5 md:h-4 md:w-4", config.colorClass)} />
								</div>
								<p className={cn("text-lg md:text-xl font-semibold tabular-nums", config.colorClass)}>{gradeCounts[grade]}</p>
								<p className="text-xs text-muted-foreground">{t(`pages.learning.session.grades.${grade}`)}</p>
							</CardContent>
						</Card>
					)
				})}
			</div>

			<div className="flex gap-2 md:gap-3">
				<Button variant="outline" className="flex-1 text-base" onClick={onFinish}>
					{t("pages.learning.complete.finishButton")}
				</Button>

				<Button className="flex-1 text-base" onClick={onContinue}>
					{t("pages.learning.complete.continueButton")}
				</Button>
			</div>
		</div>
	)
}
