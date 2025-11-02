import { Input } from "@app/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@app/components/ui/select"
import { Option } from "@app/utils/types/objectTypes"
import { Table } from "@tanstack/react-table"
import { useState } from "react"

interface DataTableFilterProps<TData> {
	table: Table<TData>
	filters: Option<string & keyof TData>[]
}

export function DataTableFilter<TData>({ table, filters }: DataTableFilterProps<TData>) {
	// --- STATE ---

	const [selectedFilter, setSelectedFilter] = useState(filters[0])

	// --- RENDER ---

	return (
		<div className="flex items-center gap-2 py-4">
			{selectedFilter && (
				<Input
					placeholder={`Filter ${selectedFilter.label}...`}
					value={(table.getColumn(selectedFilter.value)?.getFilterValue() as string) ?? ""}
					onChange={(event) => table.getColumn(selectedFilter.value)?.setFilterValue(event.target.value)}
					className="max-w-sm"
				/>
			)}

			<Select
				value={selectedFilter?.value}
				onValueChange={(value) => {
					const filter = filters.find((filter) => filter.value === value)

					setSelectedFilter(filter)
				}}
			>
				<SelectTrigger className="size-fit">
					<SelectValue placeholder={selectedFilter?.label} />
				</SelectTrigger>

				<SelectContent side="top">
					{filters.map((filter) => (
						<SelectItem key={filter.value} value={filter.value}>
							{filter.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}
