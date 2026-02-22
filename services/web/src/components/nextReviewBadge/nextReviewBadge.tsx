"use client"

import * as React from "react"
import { useTranslations } from "next-intl"

import { Badge } from "@app/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@app/components/ui/tooltip"
import { formatNextReviewDate } from "@app/utils/helpers/formatNextReviewDate"
import { cn } from "@app/utils/shadcn/shadcnHelpers"

type NextReviewBadgeProps = {
	nextReviewAt: string | null | undefined
	className?: string
}

export function NextReviewBadge({ nextReviewAt, className }: NextReviewBadgeProps) {
	const t = useTranslations()

	const isNew = !nextReviewAt
	const label = isNew ? t("common.nextReview.new") : formatNextReviewDate(nextReviewAt, t)

	// Determine if overdue or due soon for styling
	const isOverdue = nextReviewAt ? new Date(nextReviewAt).getTime() < Date.now() : false
	const isDueSoon =
		nextReviewAt && !isOverdue
			? new Date(nextReviewAt).getTime() - Date.now() < 24 * 60 * 60 * 1000
			: false

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Badge
					variant={isNew ? "outline" : "secondary"}
					className={cn(
						"text-xs cursor-help",
						isOverdue && "bg-destructive/10 text-destructive border-destructive/20",
						isDueSoon && !isOverdue && "bg-warning/10 text-warning border-warning/20",
						className,
					)}
				>
					{label}
				</Badge>
			</TooltipTrigger>
			<TooltipContent side="top" className="max-w-xs">
				<p className="text-sm">{t("common.nextReview.tooltip")}</p>
			</TooltipContent>
		</Tooltip>
	)
}
