"use client"

import * as React from "react"
import { useTranslations } from "next-intl"

import { Badge } from "@app/components/ui/badge"
import { Card, CardContent, CardHeader } from "@app/components/ui/card"
import { Checkbox } from "@app/components/ui/checkbox"
import { Skeleton } from "@app/components/ui/skeleton"

import { TranslationActions } from "@app/components/translationActions/translationActions"
import { NextReviewBadge } from "@app/components/nextReviewBadge/nextReviewBadge"
import { TranslationsTableItem } from "@app/app/[lang]/(loggedIn)/translations/_content/utils/translationsTableTypes"
import { RowSelectionState } from "@tanstack/react-table"
import { cn } from "@app/utils/shadcn/shadcnHelpers"

type TranslationsMobileProps = {
	items: TranslationsTableItem[]
	isLoading?: boolean
	skeletonRowCount?: number
	rowSelection?: RowSelectionState
	onRowSelectionChange?: (selection: RowSelectionState) => void
}

export function TranslationsMobile({
	items,
	isLoading,
	skeletonRowCount = 5,
	rowSelection,
	onRowSelectionChange,
}: TranslationsMobileProps) {
	const t = useTranslations()
	const isSelectable = rowSelection !== undefined && onRowSelectionChange !== undefined

	const toggleSelection = (translationId: number) => {
		if (!onRowSelectionChange || !rowSelection) return
		const id = translationId.toString()
		const newSelection = { ...rowSelection }
		if (newSelection[id]) {
			delete newSelection[id]
		} else {
			newSelection[id] = true
		}
		onRowSelectionChange(newSelection)
	}

	const isSelected = (translationId: number) => {
		return rowSelection?.[translationId.toString()] ?? false
	}

	if (isLoading) {
		return (
			<div className="space-y-3">
				{Array.from({ length: skeletonRowCount }).map((_, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: skeleton cards are static
					<Card key={`skeleton-${index}`} className="rounded-xl gap-3 h-37.5">
						<CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
							<div className="flex flex-wrap items-center gap-2">
								<Skeleton className="h-5 w-16" />
								<Skeleton className="h-5 w-12" />
							</div>
							<Skeleton className="h-8 w-8 rounded" />
						</CardHeader>
						<CardContent className="pt-0">
							<div className="flex gap-10">
								<div className="flex-1">
									<Skeleton className="h-3 w-10 mb-2" />
									<Skeleton className="h-5 w-24" />
								</div>
								<div className="flex-1">
									<Skeleton className="h-3 w-16 mb-2" />
									<Skeleton className="h-5 w-28" />
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		)
	}

	if (!items?.length) {
		return (
			<Card className="rounded-xl">
				<CardContent className="py-8 text-center text-sm text-muted-foreground">
					{t("pages.translations.table.emptyState")}
				</CardContent>
			</Card>
		)
	}

	return (
		<div className="space-y-3">
			{items.map((item) => {
				const cefrCode = item.cefrLevel?.code
				const posTags = item.universalPosTags ?? []
				const posPrimary = posTags[0]
				const selected = isSelected(item.translationId)

				return (
					<Card
						key={item.translationId}
						className={cn("rounded-xl gap-3", selected && "border border-primary")}
						onClick={isSelectable ? () => toggleSelection(item.translationId) : undefined}
					>
						<CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
							<div className="flex flex-wrap items-center gap-2">
								{isSelectable && (
									<Checkbox
										checked={selected}
										onCheckedChange={() => toggleSelection(item.translationId)}
										onClick={(e) => e.stopPropagation()}
										aria-label="Select row"
									/>
								)}

								{item.collectionName ? (
									<Badge variant="secondary" className="text-xs max-w-32 truncate">
										{item.collectionName}
									</Badge>
								) : null}

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
									translationId={item.translationId}
									sourceText={item.sourceText}
									targetText={item.targetText}
									cefrLevelId={item.cefrLevel?.id}
									universalPosTagIds={item.universalPosTags.map((universalPosTag) => universalPosTag.id)}
								/>
							</div>
						</CardHeader>

						<CardContent className="pt-0">
							<div className="grid grid-cols-2 gap-3">
								<div>
									<p className="text-xs text-muted-foreground">{t("pages.translations.table.columns.word")}</p>
									<p className="mt-1 text-sm font-medium break-words">{item.sourceText}</p>
								</div>

								<div>
									<p className="text-xs text-muted-foreground">{t("pages.translations.table.columns.translation")}</p>
									<p className="mt-1 text-sm break-words">{item.targetText}</p>
								</div>
							</div>
						</CardContent>
					</Card>
				)
			})}
		</div>
	)
}
