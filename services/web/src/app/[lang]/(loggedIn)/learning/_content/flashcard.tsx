"use client"

import * as React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useTranslations } from "next-intl"
import { Badge } from "@app/components/ui/badge"
import { cn } from "@app/utils/shadcn/shadcnHelpers"

type FlashcardProps = {
	sourceText: string
	targetText: string
	isRevealed: boolean
	isNew: boolean
	onFlip: () => void
}

function shuffleArray<T>(array: T[]): T[] {
	const shuffled = [...array]
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
	}
	return shuffled
}

export function Flashcard({ sourceText, targetText, isRevealed, isNew, onFlip }: FlashcardProps) {
	const t = useTranslations()
	const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set())
	const [isAnimating, setIsAnimating] = useState(false)

	const charIndices = useMemo(() => {
		const indices: number[] = []
		for (let i = 0; i < targetText.length; i++) {
			if (targetText[i] !== " ") {
				indices.push(i)
			}
		}
		return shuffleArray(indices)
	}, [targetText])

	useEffect(() => {
		if (!isRevealed) {
			setRevealedIndices(new Set())
			setIsAnimating(false)
			return
		}

		setIsAnimating(true)
		const revealOrder = [...charIndices]
		let cancelled = false

		const revealNext = (index: number) => {
			if (cancelled || index >= revealOrder.length) {
				if (!cancelled) setIsAnimating(false)
				return
			}

			setRevealedIndices((prev) => {
				const next = new Set(prev)
				next.add(revealOrder[index])
				return next
			})

			setTimeout(() => revealNext(index + 1), 50)
		}

		revealNext(0)

		return () => {
			cancelled = true
		}
	}, [isRevealed, charIndices])

	const renderTargetText = useCallback(
		(showRevealed: boolean) => {
			return targetText.split("").map((char, index) => {
				const isSpace = char === " "
				const isRevealed = showRevealed && (isSpace || revealedIndices.has(index))

				return (
					<span
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={`${char}-${index}`}
						className="relative inline-block"
					>
						<AnimatePresence mode="wait">
							{isRevealed ? (
								<motion.span
									key="char"
									initial={{ opacity: 0, scale: 0.5 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.15 }}
									className="inline-block"
								>
									{char}
								</motion.span>
							) : (
								<motion.span
									key="placeholder"
									className="inline-block text-foreground/20"
									initial={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.1 }}
								>
									{isSpace ? "\u00A0" : "•"}
								</motion.span>
							)}
						</AnimatePresence>
					</span>
				)
			})
		},
		[targetText, revealedIndices],
	)

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
				<p className="text-3xl md:text-2xl font-semibold text-center wrap-break-word">{renderTargetText(isRevealed)}</p>
				<p className="absolute bottom-6 text-sm text-foreground/40">
					{isAnimating
						? t("pages.learning.session.revealing")
						: !isRevealed
							? t("pages.learning.session.showAnswer")
							: null}
				</p>
			</div>
		</div>
	)
}
