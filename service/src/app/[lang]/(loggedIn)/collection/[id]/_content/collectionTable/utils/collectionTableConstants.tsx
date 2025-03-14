import { ColumnDef } from "@tanstack/react-table"

import { CollectionTableActions } from "@app/app/[lang]/(loggedIn)/collection/[id]/_content/collectionTable/components/collectionTableActions/collectionTableActions"
import { CollectionTranslation } from "@app/app/[lang]/(loggedIn)/collection/[id]/_content/collectionTable/utils/collectionTableTypes"
import { Checkbox } from "@app/components/ui/checkbox"
import { DataTableColumnHeader } from "@app/components/ui/dataTable/dataTableColumnHeader"

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
			return <div className="pl-3 pr-3">{row.getValue("sourceLanguage")}</div>
		},
	},
	{
		accessorKey: "sourceText",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Wort" />,
		cell: ({ row }) => {
			return <div className="pl-3 pr-3">{row.getValue("sourceText")}</div>
		},
	},
	{
		accessorKey: "targetLanguage",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Übersetzt in" />,
		cell: ({ row }) => {
			return <div className="pl-3 pr-3">{row.getValue("targetLanguage")}</div>
		},
	},
	{
		accessorKey: "targetText",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Übersetzung" />,
		cell: ({ row }) => {
			return <div className="pl-3 pr-3">{row.getValue("targetText")}</div>
		},
	},

	// https://ui.shadcn.com/docs/components/data-table#row-actions
	{
		id: "actions",
		cell: ({ row }) => <CollectionTableActions row={row} />,
	},
]
