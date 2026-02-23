"use client"

import { useTranslations } from "next-intl"
import type { RowSelectionState } from "@tanstack/react-table"

import { Badge } from "@app/components/ui/badge"
import { Card, CardContent } from "@app/components/ui/card"

import { useRowSelection } from "@app/hooks/use-row-selection"
import { TranslationCard, TranslationCardListSkeleton } from "@app/components/translationCard/translationCard"
import type { TranslationsTableItem } from "@app/app/[lang]/(loggedIn)/translations/_content/utils/translationsTableTypes"

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
	const { isSelectable, toggleSelection, isSelected } = useRowSelection({ rowSelection, onRowSelectionChange })

	if (isLoading) {
		return <TranslationCardListSkeleton count={skeletonRowCount} showCollectionBadge />
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
			{items.map((item) => (
				<TranslationCard
					key={item.translationId}
					item={item}
					selected={isSelected(item.translationId)}
					isSelectable={isSelectable}
					onToggleSelection={() => toggleSelection(item.translationId)}
					wordColumnLabel={t("pages.translations.table.columns.word")}
					translationColumnLabel={t("pages.translations.table.columns.translation")}
					renderExtraBadges={
						item.collectionName
							? () => (
									<Badge variant="secondary" className="text-xs max-w-32 truncate">
										{item.collectionName}
									</Badge>
								)
							: undefined
					}
				/>
			))}
		</div>
	)
}
