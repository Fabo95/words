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

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@app/components/ui/table"
import { Skeleton } from "@app/components/ui/skeleton"
import * as React from "react"

interface DataTableProps<TData, TValue> {
	onRowClick?: (row: TData) => void
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	isLoading?: boolean
	skeletonRowCount?: number
}

export function DataTable<TData, TValue>({
	onRowClick,
	columns,
	data,
	isLoading,
	skeletonRowCount = 5,
}: DataTableProps<TData, TValue>) {
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

	const renderSkeletonRows = () => {
		return Array.from({ length: skeletonRowCount }).map((_, rowIndex) => (
			// biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows are static
			<TableRow key={`skeleton-${rowIndex}`}>
				{columns.map((_, colIndex) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: skeleton cells are static
					<TableCell key={`skeleton-cell-${colIndex}`} className="max-w-0 h-12.25  overflow-hidden">
						<Skeleton className="h-5 w-full" />
					</TableCell>
				))}
			</TableRow>
		))
	}

	return (
		<div className="mb-3">
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
					{isLoading ? (
						renderSkeletonRows()
					) : table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								onClick={() => onRowClick?.(row.original)}
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell className="max-w-0 overflow-hidden" key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
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
	)
}
