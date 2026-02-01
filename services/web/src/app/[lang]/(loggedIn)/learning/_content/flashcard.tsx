"use client"

import * as React from "react"
import { motion } from "motion/react"
import { useTranslations } from "next-intl"
import { Badge } from "@app/components/ui/badge"
import { cn } from "@app/utils/shadcn/shadcnHelpers"

type FlashcardProps = {
	sourceText: string
	targetText: string
	isFlipped: boolean
	isNew: boolean
	onFlip: () => void
}

export function Flashcard({ sourceText, targetText, isFlipped, isNew, onFlip }: FlashcardProps) {
	const t = useTranslations()

	return (
		<div
			className="relative w-full aspect-[3/2] cursor-pointer perspective-1000"
			onClick={!isFlipped ? onFlip : undefined}
			style={{ perspective: "1000px" }}
		>
			<motion.div
				className="relative w-full h-full"
				initial={false}
				animate={{ rotateY: isFlipped ? 180 : 0 }}
				transition={{ duration: 0.5, ease: "easeInOut" }}
				style={{ transformStyle: "preserve-3d" }}
			>
				{/* Front Side */}
				<div
					className={cn(
						"absolute inset-0 w-full h-full rounded-2xl border bg-card shadow-lg",
						"flex flex-col items-center justify-center p-6",
						"backface-hidden",
					)}
					style={{ backfaceVisibility: "hidden" }}
				>
					{isNew && (
						<Badge variant="secondary" className="absolute top-4 right-4 text-xs">
							{t("pages.learning.session.newBadge")}
						</Badge>
					)}

					<p className="text-3xl md:text-4xl font-semibold text-center break-words">{sourceText}</p>

					{!isFlipped && (
						<p className="absolute bottom-6 text-sm text-foreground/40">
							{t("pages.learning.session.showAnswer")}
						</p>
					)}
				</div>

				{/* Back Side */}
				<div
					className={cn(
						"absolute inset-0 w-full h-full rounded-2xl border bg-card shadow-lg",
						"flex flex-col items-center justify-center p-6",
					)}
					style={{
						backfaceVisibility: "hidden",
						transform: "rotateY(180deg)",
					}}
				>
					{isNew && (
						<Badge variant="secondary" className="absolute top-4 right-4 text-xs">
							{t("pages.learning.session.newBadge")}
						</Badge>
					)}

					<p className="text-xl md:text-2xl text-foreground/60 text-center mb-4">{sourceText}</p>
					<p className="text-3xl md:text-4xl font-semibold text-center break-words">{targetText}</p>
				</div>
			</motion.div>
		</div>
	)
}
