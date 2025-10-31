import { ColumnDef } from "@tanstack/react-table"

import { CollectionTableActions } from "services/words/src/app/[lang]/(loggedIn)/collection/[id]/_content/collectionTable/components/collectionTableActions/collectionTableActions"
import { CollectionTranslation } from "services/words/src/app/[lang]/(loggedIn)/collection/[id]/_content/collectionTable/utils/collectionTableTypes"
import { Checkbox } from "services/words/src/components/ui/checkbox"
import { DataTableColumnHeader } from "services/words/src/components/ui/dataTable/dataTableColumnHeader"
import { FormField } from "services/words/src/components/ui/formField"
import { Input } from "services/words/src/components/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "services/words/src/components/ui/tooltip"
import * as React from "react"

export const COLLECTION_TABLE_COLUMNS: ColumnDef<CollectionTranslation>[] = [
	// https://ui.shadcn.com/docs/components/data-table#row-selection
	{
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
	{
		accessorKey: "sourceLanguage",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Übersetzt von" />,
		cell: ({ row }) => {
			return <p className="pl-3 pr-3 truncate">{row.getValue("sourceLanguage")}</p>
		},
	},
	{
		accessorKey: "sourceText",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Wort" />,
		cell: ({ row }) => {
			return <p className="pl-3 pr-3 truncate">{row.getValue("sourceText")}</p>
		},
	},
	{
		accessorKey: "targetLanguage",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Übersetzt in" />,
		cell: ({ row }) => {
			return <p className="pl-3 pr-3 truncate">{row.getValue("targetLanguage")}</p>
		},
	},
	{
		accessorKey: "targetText",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Übersetzung" />,
		cell: ({ row }) => {
			return <p className="pl-3 pr-3 truncate">{row.getValue("targetText")}</p>
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
