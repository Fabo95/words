"use client"

import type { SyntheticEvent } from "react"
import { useTranslations } from "next-intl"

import { Badge } from "@app/components/ui/badge"
import { Card, CardContent } from "@app/components/ui/card"
import { Checkbox } from "@app/components/ui/checkbox"
import { Input } from "@app/components/ui/input"

import type { BulkImportItem } from "@app/app/[lang]/(loggedIn)/bulk-import/_content/utils/bulkImportTypes"

type BulkImportMobileProps = {
	items: BulkImportItem[]
	selectedCount: number
	onToggleSelection: (index: number) => void
	onToggleAll: () => void
	onEditSourceText: (index: number, value: string) => void
	onEditTargetText: (index: number, value: string) => void
}

const getConfidenceBadge = (confidence: number) => {
	const percentage = `${Math.round(confidence * 100)}%`

	if (confidence >= 0.9) {
		return (
			<Badge variant="outline" className="border-green-500 text-xs">
				{percentage}
			</Badge>
		)
	}

	if (confidence >= 0.7) {
		return (
			<Badge variant="outline" className="border-yellow-500 text-xs">
				{percentage}
			</Badge>
		)
	}

	return (
		<Badge variant="outline" className="border-red-500 text-xs">
			{percentage}
		</Badge>
	)
}

export function BulkImportMobile({
	items,
	selectedCount,
	onToggleSelection,
	onToggleAll,
	onEditSourceText,
	onEditTargetText,
}: BulkImportMobileProps) {
	const t = useTranslations()

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2 mb-3">
				<Checkbox checked={items.every((item) => item.selected)} onCheckedChange={onToggleAll} />
				<span className="text-sm text-muted-foreground">
					{t("components.bulkActions.selected", { count: selectedCount })}
				</span>
			</div>

			{items.map((translation, index) => (
				<Card
					onClick={() => onToggleSelection(index)}
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					key={index}
					className={`rounded-xl select-none ${translation.selected ? "ring-1 ring-primary" : ""}`}
				>
					<CardContent className="p-4">
						<div className="flex items-start gap-3 mb-4">
							<Checkbox checked={translation.selected} className="mt-1" />
							<div className="flex items-center">{getConfidenceBadge(translation.confidence)}</div>
						</div>

						<div className="flex flex-col space-y-3">
							<div>
								{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
								<label className="text-xs text-muted-foreground">{t("pages.bulkImport.table.sourceText")}</label>
								<Input
									onClick={(event: SyntheticEvent) => event.stopPropagation()}
									value={translation.source_text}
									onChange={(e) => onEditSourceText(index, e.target.value)}
									className="h-8 mt-1"
								/>
							</div>
							<div>
								{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
								<label className="text-xs text-muted-foreground">{t("pages.bulkImport.table.targetText")}</label>
								<Input
									onClick={(event: SyntheticEvent) => event.stopPropagation()}
									value={translation.target_text}
									onChange={(e) => onEditTargetText(index, e.target.value)}
									className="h-8 mt-1"
								/>
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	)
}
