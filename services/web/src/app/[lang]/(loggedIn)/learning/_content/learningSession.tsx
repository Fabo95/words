"use client"

import * as React from "react"
import { useState, useCallback, useEffect } from "react"
import { motion } from "motion/react"
import { useTranslations } from "next-intl"
import { Button } from "@app/components/ui/button"
import { useToast } from "@app/components/ui/use-toast"
import { $api } from "@app/utils/api/apiRequests"
import { Flashcard } from "./flashcard"
import { X, Check } from "lucide-react"
import { LearnItem } from "@app/utils/types/api"

type LearningSessionProps = {
	currentItem: LearnItem
	currentIndex: number
	totalItems: number
	onReview: (correct: boolean, translationId: number) => void
}

export function LearningSession({ currentItem, currentIndex, totalItems, onReview }: LearningSessionProps) {
	const t = useTranslations()
	const { toast } = useToast()

	const [isFlipped, setIsFlipped] = useState(false)
	const [showButtons, setShowButtons] = useState(false)

	const { mutate: submitReview, isPending } = $api.useMutation("patch", "/learn/{translation_id}/review", {
		onSuccess: (_, variables) => {
			setIsFlipped(false)
			setShowButtons(false)
			onReview(variables.body.correct, currentItem.id)
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
		(correct: boolean) => {
			submitReview({
				params: { path: { translation_id: currentItem.id } },
				body: { correct },
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
				if (e.code === "ArrowLeft" || e.code === "Digit1" || e.code === "Numpad1") {
					e.preventDefault()
					handleReview(false)
				} else if (e.code === "ArrowRight" || e.code === "Digit2" || e.code === "Numpad2") {
					e.preventDefault()
					handleReview(true)
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
					sourceText={currentItem.sourceText}
					targetText={currentItem.targetText}
					isRevealed={isFlipped}
					isNew={currentItem.isNew}
					onFlip={handleFlip}
					onRevealComplete={handleRevealComplete}
				/>
			</div>

			{/* Actions */}
			<div className="h-10">
				{showButtons && (
					<motion.div
						className="flex gap-3"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.3 }}
					>
						<Button
							variant="secondary"
							className="flex-1 text-base"
							onClick={() => handleReview(false)}
							disabled={isPending}
						>
							<X className="h-5 w-5 mr-2" />
							{t("pages.learning.session.wrong")}
						</Button>
						<Button
							variant="default"
							className="flex-1 text-base"
							onClick={() => handleReview(true)}
							disabled={isPending}
							isLoading={isPending}
						>
							<Check className="h-5 w-5 mr-2" />
							{t("pages.learning.session.right")}
						</Button>
					</motion.div>
				)}
			</div>

					</div>
	)
}
