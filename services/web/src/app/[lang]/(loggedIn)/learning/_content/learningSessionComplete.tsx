"use client"

import { useTranslations } from "next-intl"
import { Button } from "@app/components/ui/button"
import { Card, CardContent } from "@app/components/ui/card"
import { CheckCircle2, XCircle, Trophy } from "lucide-react"
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

export function LearningSessionComplete({ results, totalItems, onContinue, onFinish }: LearningSessionCompleteProps) {
	const t = useTranslations()

	const correctCount = results.filter((r) => r.grade === "good" || r.grade === "easy").length
	const incorrectCount = results.filter((r) => r.grade === "again" || r.grade === "hard").length

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

			<div className="grid grid-cols-2 gap-3 mb-8">
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
								<CheckCircle2 className="h-5 w-5 text-green-600" />
							</div>
							<div>
								<p className="text-2xl font-semibold tabular-nums text-green-600">{correctCount}</p>
								<p className="text-xs text-foreground/50">
									{t("pages.learning.complete.correct")}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
								<XCircle className="h-5 w-5 text-destructive" />
							</div>
							<div>
								<p className="text-2xl font-semibold tabular-nums text-destructive">{incorrectCount}</p>
								<p className="text-xs text-foreground/50">
									{t("pages.learning.complete.incorrect")}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="flex gap-3">
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
