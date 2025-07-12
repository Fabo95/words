"use client"

import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table"
import { useState } from "react"

import { DataTableFilter } from "@app/components/ui/dataTable/dataTableFilter"
import { DataTablePagination } from "@app/components/ui/dataTable/dataTablePagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@app/components/ui/table"
import { Tooltip, TooltipContent, TooltipTrigger } from "@app/components/ui/tooltip"
import { Option } from "@app/utils/types/objectTypes"
import * as React from "react"

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	filters: Option<string & keyof TData>[]
}

export function DataTable<TData, TValue>({ columns, data, filters }: DataTableProps<TData, TValue>) {
	// --- STATE ---

	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [rowSelection, setRowSelection] = useState({})

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			rowSelection,
		},
	})

	// --- RENDER

	return (
		<>
			<DataTableFilter filters={filters} table={table} />

			<div className="rounded-md border mb-3">
				<Table className="table-auto w-full">
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead className="whitespace-nowral" key={header.id}>
											{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>

					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
									{row.getVisibleCells().map((cell) => (
										<TableCell className="max-w-0 overflow-hidden" key={cell.id}>
											<Tooltip>
												<TooltipContent>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TooltipContent>

												<TooltipTrigger className="w-full">
													{flexRender(cell.column.columnDef.cell, cell.getContext())}
												</TooltipTrigger>
											</Tooltip>
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center max-w-0 overflow-hidden">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<DataTablePagination table={table} />
		</>
	)
}
