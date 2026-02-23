"use client"

import { useTranslations } from "next-intl"
import type { RowSelectionState } from "@tanstack/react-table"

import { Card, CardContent } from "@app/components/ui/card"

import { useRowSelection } from "@app/hooks/use-row-selection"
import { TranslationCard, TranslationCardListSkeleton } from "@app/components/translationCard/translationCard"
import type { CollectionTranslation } from "@app/app/[lang]/(loggedIn)/collection/[id]/_content/collection/utils/collectionTableTypes"

type CollectionsTranslationsMobileProps = {
	items: CollectionTranslation[]
	isLoading?: boolean
	skeletonRowCount?: number
	rowSelection?: RowSelectionState
	onRowSelectionChange?: (selection: RowSelectionState) => void
}

export function CollectionsTranslationsMobile({
	items,
	isLoading,
	skeletonRowCount = 5,
	rowSelection,
	onRowSelectionChange,
}: CollectionsTranslationsMobileProps) {
	const t = useTranslations()
	const { isSelectable, toggleSelection, isSelected } = useRowSelection({ rowSelection, onRowSelectionChange })

	if (isLoading) {
		return <TranslationCardListSkeleton count={skeletonRowCount} />
	}

	if (!items?.length) {
		return (
			<Card className="rounded-xl">
				<CardContent className="py-8 text-center text-sm text-muted-foreground">
					{t("pages.collection.table.emptyState", { default: "No results." })}
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
					collectionId={item.id}
					wordColumnLabel={t("pages.collection.table.columns.word")}
					translationColumnLabel={t("pages.collection.table.columns.translation")}
				/>
			))}
		</div>
	)
}
