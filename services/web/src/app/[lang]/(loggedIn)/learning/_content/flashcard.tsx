"use client"

import { useMemo } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useTranslations } from "next-intl"
import { Keyboard, Check, X, Minus } from "lucide-react"
import { Badge } from "@app/components/ui/badge"
import { cn } from "@app/utils/shadcn/shadcnHelpers"
import { TFunction } from "@app/utils/types/tFunction"
import type { ReviewGrade } from "./utils/useLearningSessionQuery"

type ReviewResult = {
	grade: ReviewGrade
	nextReviewAt: string
	newInterval: number
}

type FlashcardProps = {
	sourceText: string
	targetText: string
	isRevealed: boolean
	isNew: boolean
	onFlip: () => void
	onRevealComplete?: () => void
	reviewResult?: ReviewResult | null
}

function formatNextReview(intervalDays: number, t: TFunction): string {
	if (intervalDays === 0) {
		return t("pages.learning.session.nextReview.today")
	}
	if (intervalDays === 1) {
		return t("pages.learning.session.nextReview.tomorrow")
	}
	return t("pages.learning.session.nextReview.inDays", { days: intervalDays })
}

function shuffleArray<T>(array: T[]): T[] {
	const shuffled = [...array]
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		// @ts-ignore
		;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
	}
	return shuffled
}

export function Flashcard({
	sourceText,
	targetText,
	isRevealed,
	isNew,
	onFlip,
	onRevealComplete,
	reviewResult,
}: FlashcardProps) {
	const t = useTranslations()

	const { charDelays, lastCharIndex } = useMemo(() => {
		const indices: number[] = []
		for (let i = 0; i < targetText.length; i++) {
			if (targetText[i] !== " ") {
				indices.push(i)
			}
		}
		const shuffled = shuffleArray(indices)
		return {
			charDelays: new Map(shuffled.map((idx, pos) => [idx, pos * 0.05])),
			lastCharIndex: shuffled[shuffled.length - 1],
		}
	}, [targetText])

	const renderTargetText = () => {
		return targetText.split("").map((char, index) => {
			const isSpace = char === " "
			const delay = charDelays.get(index) ?? 0
			const isLastChar = index === lastCharIndex

			return (
				// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
				<span key={index} className="relative inline-block overflow-hidden">
					{isRevealed && !isSpace ? (
						<motion.span
							className="inline-block"
							initial={{ y: "100%" }}
							animate={{ y: 0 }}
							transition={{ duration: 0.2, delay, ease: "easeOut" }}
							onAnimationComplete={isLastChar ? onRevealComplete : undefined}
						>
							{char}
						</motion.span>
					) : (
						<span className={isRevealed ? "" : "text-foreground/20"}>
							{isSpace ? "\u00A0" : isRevealed ? char : "•"}
						</span>
					)}
				</span>
			)
		})
	}

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<div
			className={cn("relative w-full aspect-3/2", !isRevealed && "cursor-pointer")}
			onClick={!isRevealed ? onFlip : undefined}
		>
			<div
				className={cn(
					"w-full h-full rounded-2xl border bg-card shadow-lg",
					"flex flex-col items-center justify-center p-6",
				)}
			>
				<AnimatePresence>
					{reviewResult && (
						<motion.div
							initial={{ scale: 0, rotate: -180 }}
							animate={{ scale: 1, rotate: 0 }}
							exit={{ scale: 0, rotate: 180 }}
							transition={{ type: "spring", stiffness: 300, damping: 20 }}
							className={cn(
								"absolute top-4 left-4 flex h-6 w-6 items-center justify-center rounded-full",
								reviewResult.grade === "good" || reviewResult.grade === "easy"
									? "bg-green-500/10"
									: reviewResult.grade === "hard"
										? "bg-yellow-500/10"
										: "bg-red-500/10",
							)}
						>
							{reviewResult.grade === "good" || reviewResult.grade === "easy" ? (
								<Check className="h-4 w-4 text-green-500" />
							) : reviewResult.grade === "hard" ? (
								<Minus className="h-4 w-4 text-yellow-500" />
							) : (
								<X className="h-4 w-4 text-red-500" />
							)}
						</motion.div>
					)}
				</AnimatePresence>

				{isNew && (
					<Badge variant="secondary" className="absolute top-4 right-4 text-xs">
						{t("pages.learning.session.newBadge")}
					</Badge>
				)}

				<p className="text-3xl md:text-2xl font-semibold text-center wrap-break-word mb-2">{sourceText}</p>
				<p className="text-3xl md:text-2xl font-semibold text-center wrap-break-word">{renderTargetText()}</p>

				{reviewResult && (
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="absolute bottom-6 text-xs text-muted-foreground"
					>
						{formatNextReview(reviewResult.newInterval, t)}
					</motion.p>
				)}

				{!reviewResult && (
					<div className="absolute bottom-6 flex flex-col items-center gap-1 text-xs text-muted-foreground">
						<Keyboard className="h-3 w-3" />
						{!isRevealed ? (
							<>
								<span>{t("pages.learning.session.shortcuts.reveal")}</span>
								<span>{t("pages.learning.session.shortcuts.revealAlt")}</span>
							</>
						) : (
							<span>{t("pages.learning.session.shortcuts.grades")}</span>
						)}
					</div>
				)}
			</div>
		</div>
	)
}
