"use client"

import { useTranslations } from "next-intl"

import { Badge } from "@app/components/ui/badge"
import { Checkbox } from "@app/components/ui/checkbox"
import { Input } from "@app/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@app/components/ui/table"

import type { BulkImportItem } from "@app/app/[lang]/(loggedIn)/bulk-import/_content/utils/bulkImportTypes"

type BulkImportTableProps = {
	items: BulkImportItem[]
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

export function BulkImportTable({
	items,
	onToggleSelection,
	onToggleAll,
	onEditSourceText,
	onEditTargetText,
}: BulkImportTableProps) {
	const t = useTranslations()

	return (
		<div className="border rounded-lg overflow-hidden">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-12">
							<Checkbox checked={items.every((item) => item.selected)} onCheckedChange={onToggleAll} />
						</TableHead>
						<TableHead>{t("pages.bulkImport.table.sourceText")}</TableHead>
						<TableHead>{t("pages.bulkImport.table.targetText")}</TableHead>
						<TableHead className="w-32">{t("pages.bulkImport.table.confidence")}</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{items.map((translation, index) => (
						<TableRow key={index}>
							<TableCell>
								<Checkbox
									checked={translation.selected}
									onCheckedChange={() => onToggleSelection(index)}
								/>
							</TableCell>
							<TableCell>
								<Input
									value={translation.source_text}
									onChange={(e) => onEditSourceText(index, e.target.value)}
									className="h-8"
								/>
							</TableCell>
							<TableCell>
								<Input
									value={translation.target_text}
									onChange={(e) => onEditTargetText(index, e.target.value)}
									className="h-8"
								/>
							</TableCell>
							<TableCell>{getConfidenceBadge(translation.confidence)}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
