import { Input } from "@app/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@app/components/ui/select"
import { Table } from "@tanstack/react-table"
import { useState } from "react"

interface DataTableFilterProps<TData> {
	table: Table<TData>
	filters: (string & keyof TData)[]
}

export function DataTableFilter<TData>({ table, filters }: DataTableFilterProps<TData>) {
	// --- STATE ---

	const [selectFilterValue, setSelectFilterValue] = useState(filters[0])

	// --- RENDER ---

	return (
		<div className="flex items-center gap-2 py-4">
			{selectFilterValue && (
				<Input
					placeholder="Filter emails..."
					value={(table.getColumn(selectFilterValue)?.getFilterValue() as string) ?? ""}
					onChange={(event) => table.getColumn(selectFilterValue)?.setFilterValue(event.target.value)}
					className="max-w-sm"
				/>
			)}

			<Select
				value={selectFilterValue}
				onValueChange={(value) => {
					setSelectFilterValue(value)
				}}
			>
				<SelectTrigger className="size-fit">
					<SelectValue placeholder={selectFilterValue} />
				</SelectTrigger>

				<SelectContent side="top">
					{filters.map((filter) => (
						<SelectItem key={filter} value={`${filter}`}>
							{filter}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}
