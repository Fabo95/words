import { ColumnDef } from "@tanstack/react-table"

import { CollectionTableActions } from "@app/app/[lang]/(loggedIn)/collection/[id]/_content/collectionTable/components/collectionTableActions/collectionTableActions"
import { CollectionTranslation } from "@app/app/[lang]/(loggedIn)/collection/[id]/_content/collectionTable/utils/collectionTableTypes"
import { Checkbox } from "@app/components/ui/checkbox"
import { DataTableColumnHeader } from "@app/components/ui/dataTable/dataTableColumnHeader"
import { FormField } from "@app/components/ui/formField"
import { Input } from "@app/components/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@app/components/ui/tooltip"
import * as React from "react"
import { Badge } from "@app/components/ui/badge"
import { TFunction } from "@app/utils/types/tFunction"

export const getCollectionTableColumns: (t: TFunction) => ColumnDef<CollectionTranslation>[] = (t) => [
	// https://ui.shadcn.com/docs/components/data-table#row-selection
	/* {
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
		},
	 */

	{
		accessorKey: "sourceText",
		header: ({ column }) => <DataTableColumnHeader column={column} title={t("pages.collection.table.columns.word")} />,
		cell: ({ row }) => {
			return <p className="pl-3 pr-3 truncate">{row.getValue("sourceText")}</p>
		},
	},

	{
		accessorKey: "targetText",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title={t("pages.collection.table.columns.translation")} />
		),
		cell: ({ row }) => {
			return <p className="pl-3 pr-3 truncate">{row.getValue("targetText")}</p>
		},
	},

	{
		accessorKey: "cefrLevel",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title={t("pages.collection.table.columns.cefrLevel")} />
		),
		cell: ({ row }) => {
			const te = row.original.cefrLevel?.code

			return (
				<Badge variant="secondary" className="text-xs">
					{te}
				</Badge>
			)
		},
	},

	{
		accessorKey: "universalPosTags",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title={t("pages.collection.table.columns.universalPosTags")} />
		),
		cell: ({ row }) => {
			const names = row.original.universalPosTags?.map((tag) => tag.name) ?? []

			return (
				<div className="flex gap-1 flex-wrap">
					{names?.map((name, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: stable display-only list
						<Badge key={index} variant="secondary" className="text-xs">
							{name}
						</Badge>
					))}
				</div>
			)
		},
	},

	// https://ui.shadcn.com/docs/components/data-table#row-actions
	{
		id: "actions",
		header: () => <div className="w-11" />,
		cell: ({ row }) => (
			<div className="pl-3 pr-3">
				<CollectionTableActions row={row} />
			</div>
		),
	},
]
