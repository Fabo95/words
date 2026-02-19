import { ColumnDef } from "@tanstack/react-table"

import { TranslationActions } from "@app/components/translationActions/translationActions"
import { TranslationsTableItem } from "@app/app/[lang]/(loggedIn)/translations/_content/utils/translationsTableTypes"
import { DataTableColumnHeader } from "@app/components/ui/dataTable/dataTableColumnHeader"
import { Badge } from "@app/components/ui/badge"
import { TFunction } from "@app/utils/types/tFunction"
import { getCollectionPage } from "@app/utils/urls/urls"
import { formatNextReviewDate } from "@app/utils/helpers/formatNextReviewDate"
import * as React from "react"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

export const getTranslationsTableColumns = (
	t: TFunction,
	router: AppRouterInstance,
): ColumnDef<TranslationsTableItem>[] => {
	return [
		{
			accessorKey: "sourceText",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title={t("pages.translations.table.columns.word")} />
			),
			cell: ({ row }) => {
				return <p className="pl-3 pr-3 truncate">{row.getValue("sourceText")}</p>
			},
		},

		{
			accessorKey: "targetText",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title={t("pages.translations.table.columns.translation")} />
			),
			cell: ({ row }) => {
				return <p className="pl-3 pr-3 truncate">{row.getValue("targetText")}</p>
			},
		},

		{
			accessorKey: "collectionName",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title={t("pages.translations.table.columns.collection")} />
			),
			cell: ({ row }) => {
				const collectionName = row.original.collectionName

				const collectionId = row.original.collectionId

				return collectionName && collectionId ? (
					<Badge
						onClick={() => router.push(getCollectionPage(collectionId))}
						variant="secondary"
						className="max-w-55 truncate text-xs cursor-pointer"
						title={collectionName}
					>
						{collectionName}
					</Badge>
				) : null
			},
		},

		{
			accessorKey: "cefrLevel",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title={t("pages.translations.table.columns.cefrLevel")} />
			),
			cell: ({ row }) => {
				const cefrCode = row.original.cefrLevel?.code

				return cefrCode ? (
					<Badge variant="secondary" className="text-xs">
						{cefrCode}
					</Badge>
				) : null
			},
		},

		{
			accessorKey: "universalPosTags",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title={t("pages.translations.table.columns.universalPosTags")} />
			),
			cell: ({ row }) => {
				const tags = row.original.universalPosTags ?? []

				return (
					<div className="flex gap-1 flex-wrap">
						{tags.map((tag) => (
							<Badge key={tag.id} variant="secondary" className="text-xs">
								{
									// @ts-ignore
									t(`common.posTags.${tag.code}`)
								}
							</Badge>
						))}
					</div>
				)
			},
		},

		{
			accessorKey: "learningProgress",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title={t("pages.translations.table.columns.nextReview")} />
			),
			cell: ({ row }) => {
				const learningProgress = row.original.learningProgress

				if (!learningProgress) {
					return <span className="text-muted-foreground text-xs">{t("common.nextReview.new")}</span>
				}

				return <span className="text-xs">{formatNextReviewDate(learningProgress.next_review_at, t)}</span>
			},
		},

		{
			id: "actions",
			header: () => <div className="w-11" />,
			cell: ({ row }) => (
				<div className="pl-3 pr-3">
					<TranslationActions
						collectionId={row.original.collectionId}
						translationId={row.original.translationId}
						sourceText={row.original.sourceText}
						targetText={row.original.targetText}
						cefrLevelId={row.original.cefrLevel?.id}
						universalPosTagIds={row.original.universalPosTags.map((universalPosTag) => universalPosTag.id)}
					/>
				</div>
			),
		},
	]
}
