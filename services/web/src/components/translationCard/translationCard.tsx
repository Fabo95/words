"use client"

import type { ReactNode } from "react"
import { useTranslations } from "next-intl"

import { Badge } from "@app/components/ui/badge"
import { Card, CardContent, CardHeader } from "@app/components/ui/card"
import { Checkbox } from "@app/components/ui/checkbox"
import { Skeleton } from "@app/components/ui/skeleton"
import { NextReviewBadge } from "@app/components/nextReviewBadge/nextReviewBadge"
import { TranslationActions } from "@app/components/translationActions/translationActions"
import { cn } from "@app/utils/shadcn/shadcnHelpers"
import type { CefrLevel, LearningProgress, UniversalPosTag } from "@app/utils/types/api"

export type TranslationCardItem = {
	translationId: number
	sourceText: string
	targetText: string
	cefrLevel?: CefrLevel
	universalPosTags: UniversalPosTag[]
	learningProgress?: LearningProgress
}

type TranslationCardProps = {
	item: TranslationCardItem
	selected: boolean
	isSelectable: boolean
	onToggleSelection: () => void
	collectionId?: number
	renderExtraBadges?: () => ReactNode
	wordColumnLabel: string
	translationColumnLabel: string
}

export function TranslationCard({
	item,
	selected,
	isSelectable,
	onToggleSelection,
	collectionId,
	renderExtraBadges,
	wordColumnLabel,
	translationColumnLabel,
}: TranslationCardProps) {
	const t = useTranslations()
	const cefrCode = item.cefrLevel?.code
	const posTags = item.universalPosTags ?? []
	const posPrimary = posTags[0]

	return (
		<Card
			className={cn("rounded-xl gap-3", selected && "border border-primary")}
			onClick={isSelectable ? onToggleSelection : undefined}
		>
			<CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
				<div className="flex flex-wrap items-center gap-2">
					{isSelectable && (
						<Checkbox
							checked={selected}
							onCheckedChange={onToggleSelection}
							onClick={(e) => e.stopPropagation()}
							aria-label="Select row"
						/>
					)}

					{renderExtraBadges?.()}

					{cefrCode ? (
						<Badge variant="secondary" className="text-xs">
							{cefrCode}
						</Badge>
					) : null}

					{posPrimary ? (
						<Badge variant="secondary" className="text-xs">
							{t(`common.posTags.${posPrimary.code}`)}
							{posTags.length > 1 ? ` +${posTags.length - 1}` : ""}
						</Badge>
					) : null}

					<NextReviewBadge nextReviewAt={item.learningProgress?.next_review_at} />
				</div>

				<div className="shrink-0">
					<TranslationActions
						collectionId={collectionId}
						translationId={item.translationId}
						sourceText={item.sourceText}
						targetText={item.targetText}
						cefrLevelId={item.cefrLevel?.id}
						universalPosTagIds={item.universalPosTags.map((tag) => tag.id)}
					/>
				</div>
			</CardHeader>

			<CardContent className="pt-0">
				<div className="grid grid-cols-2 gap-3">
					<div>
						<p className="text-xs text-muted-foreground">{wordColumnLabel}</p>
						<p className="mt-1 text-sm font-medium break-words">{item.sourceText}</p>
					</div>

					<div>
						<p className="text-xs text-muted-foreground">{translationColumnLabel}</p>
						<p className="mt-1 text-sm break-words">{item.targetText}</p>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

type TranslationCardSkeletonProps = {
	showCollectionBadge?: boolean
}

export function TranslationCardSkeleton({ showCollectionBadge = false }: TranslationCardSkeletonProps) {
	return (
		<Card className="rounded-xl gap-3">
			<CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
				<div className="flex flex-wrap items-center gap-2">
					{showCollectionBadge && <Skeleton className="h-5 w-16" />}
					<Skeleton className="h-5 w-12" />
					<Skeleton className="h-5 w-16" />
				</div>
				<Skeleton className="h-8 w-8 rounded" />
			</CardHeader>
			<CardContent className="pt-0">
				<div className="grid grid-cols-2 gap-3">
					<div>
						<Skeleton className="h-3 w-10 mb-2" />
						<Skeleton className="h-5 w-24" />
					</div>
					<div>
						<Skeleton className="h-3 w-16 mb-2" />
						<Skeleton className="h-5 w-28" />
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

type TranslationCardListSkeletonProps = {
	count?: number
	showCollectionBadge?: boolean
}

export function TranslationCardListSkeleton({ count = 5, showCollectionBadge = false }: TranslationCardListSkeletonProps) {
	return (
		<div className="space-y-3">
			{Array.from({ length: count }).map((_, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: skeleton cards are static
				<TranslationCardSkeleton key={`skeleton-${index}`} showCollectionBadge={showCollectionBadge} />
			))}
		</div>
	)
}
