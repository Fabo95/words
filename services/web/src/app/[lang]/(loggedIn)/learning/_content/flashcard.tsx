"use client"

import { useMemo } from "react"
import { motion } from "motion/react"
import { useTranslations } from "next-intl"
import { Badge } from "@app/components/ui/badge"
import { cn } from "@app/utils/shadcn/shadcnHelpers"

type FlashcardProps = {
	sourceText: string
	targetText: string
	isRevealed: boolean
	isNew: boolean
	onFlip: () => void
	onRevealComplete?: () => void
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

export function Flashcard({ sourceText, targetText, isRevealed, isNew, onFlip, onRevealComplete }: FlashcardProps) {
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
				{isNew && (
					<Badge variant="secondary" className="absolute top-4 right-4 text-xs">
						{t("pages.learning.session.newBadge")}
					</Badge>
				)}

				<p className="text-3xl md:text-2xl font-semibold text-center wrap-break-word mb-2">{sourceText}</p>
				<p className="text-3xl md:text-2xl font-semibold text-center wrap-break-word">{renderTargetText()}</p>
				{!isRevealed && (
					<p className="absolute bottom-6 text-sm text-foreground/40">
						{t("pages.learning.session.showAnswer")}
					</p>
				)}
			</div>
		</div>
	)
}
