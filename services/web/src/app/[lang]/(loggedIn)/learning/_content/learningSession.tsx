"use client"

import * as React from "react"
import { useState, useCallback, useEffect, useRef } from "react"
import { motion } from "motion/react"
import { useTranslations } from "next-intl"
import { Button } from "@app/components/ui/button"
import { useToast } from "@app/components/ui/use-toast"
import { $api } from "@app/utils/api/apiRequests"
import { Flashcard } from "./flashcard"
import { LearnItem } from "@app/utils/types/api"
import type { ReviewGrade } from "./utils/useLearningSessionQuery"

export type { ReviewGrade }

type ReviewResult = {
	grade: ReviewGrade
	nextReviewAt: string
	newInterval: number
}

type LearningSessionProps = {
	currentItem: LearnItem
	currentIndex: number
	totalItems: number
	onReview: (grade: ReviewGrade, translationId: number) => void
	reverseMode: boolean
}

export function LearningSession({
	currentItem,
	currentIndex,
	totalItems,
	onReview,
	reverseMode,
}: LearningSessionProps) {
	const t = useTranslations()
	const { toast } = useToast()

	const [isFlipped, setIsFlipped] = useState(false)
	const [showButtons, setShowButtons] = useState(false)
	const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null)
	const timeoutRef = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current)
		}
	}, [])

	const { mutate: submitReview, isPending } = $api.useMutation("patch", "/learn/{translation_id}/review", {
		onSuccess: (response, variables) => {
			const data = response.data
			if (data) {
				setReviewResult({
					grade: variables.body.grade as ReviewGrade,
					nextReviewAt: data.learning_progress.next_review_at,
					newInterval: data.new_interval,
				})
				setShowButtons(false)

				// Auto-advance after showing result
				timeoutRef.current = setTimeout(() => {
					setIsFlipped(false)
					setReviewResult(null)
					onReview(variables.body.grade as ReviewGrade, currentItem.id)
				}, 1500)
			} else {
				setIsFlipped(false)
				setShowButtons(false)
				onReview(variables.body.grade as ReviewGrade, currentItem.id)
			}
		},
		onError: () => {
			toast({
				title: t("pages.learning.toast.reviewError.title"),
				description: t("pages.learning.toast.reviewError.description"),
				variant: "destructive",
			})
		},
	})

	const handleFlip = useCallback(() => {
		setIsFlipped(true)
	}, [])

	const handleRevealComplete = useCallback(() => {
		setShowButtons(true)
	}, [])

	const handleReview = useCallback(
		(grade: ReviewGrade) => {
			submitReview({
				params: { path: { translation_id: currentItem.id } },
				body: { grade },
			})
		},
		[submitReview, currentItem.id],
	)

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (isPending) return

			if (!isFlipped && e.code === "Space") {
				e.preventDefault()
				handleFlip()
				return
			}

			if (showButtons) {
				if (e.code === "Digit1" || e.code === "Numpad1") {
					e.preventDefault()
					handleReview("again")
				} else if (e.code === "Digit2" || e.code === "Numpad2") {
					e.preventDefault()
					handleReview("hard")
				} else if (e.code === "Digit3" || e.code === "Numpad3") {
					e.preventDefault()
					handleReview("good")
				} else if (e.code === "Digit4" || e.code === "Numpad4") {
					e.preventDefault()
					handleReview("easy")
				}
			}
		}

		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [isFlipped, showButtons, isPending, handleFlip, handleReview])

	return (
		<div className="mx-auto w-full max-w-lg">
			{/* Progress */}
			<div className="mb-6">
				<div className="flex justify-between items-center mb-2">
					<p className="text-sm text-muted-foreground">
						{t("pages.learning.session.progress", {
							current: currentIndex + 1,
							total: totalItems,
						})}
					</p>
				</div>
				<div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
					<div
						className="h-full bg-primary transition-all duration-300 ease-out"
						style={{ width: `${((currentIndex + 1) / totalItems) * 100}%` }}
					/>
				</div>
			</div>

			{/* Flashcard */}
			<div className="mb-8">
				<Flashcard
					sourceText={reverseMode ? currentItem.targetText : currentItem.sourceText}
					targetText={reverseMode ? currentItem.sourceText : currentItem.targetText}
					isRevealed={isFlipped}
					isNew={currentItem.isNew}
					onFlip={handleFlip}
					onRevealComplete={handleRevealComplete}
					reviewResult={reviewResult}
				/>
			</div>

			{/* Actions */}
			<div className="min-h-10">
				{showButtons && (
					<motion.div
						className="grid grid-cols-2 gap-2 md:flex md:gap-2"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.3 }}
					>
						<Button
							variant="outline"
							className="md:flex-1"
							onClick={() => handleReview("again")}
							disabled={isPending}
						>
							{t("pages.learning.session.grades.again")}
						</Button>
						<Button
							variant="outline"
							className="md:flex-1"
							onClick={() => handleReview("hard")}
							disabled={isPending}
						>
							{t("pages.learning.session.grades.hard")}
						</Button>
						<Button
							variant="outline"
							className="md:flex-1"
							onClick={() => handleReview("good")}
							disabled={isPending}
						>
							{t("pages.learning.session.grades.good")}
						</Button>
						<Button
							variant="outline"
							className="md:flex-1"
							onClick={() => handleReview("easy")}
							disabled={isPending}
						>
							{t("pages.learning.session.grades.easy")}
						</Button>
					</motion.div>
				)}
			</div>
		</div>
	)
}
