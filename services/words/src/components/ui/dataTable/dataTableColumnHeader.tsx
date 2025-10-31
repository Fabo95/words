import { Column } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from "lucide-react"

import { Button } from "services/words/src/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "services/words/src/components/ui/dropdown-menu"
import { cn } from "services/words/src/utils/shadcn/shadcnHelpers"
import { useMemo } from "react"

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>
	title: string
}

export function DataTableColumnHeader<TData, TValue>({
	column,
	title,
	className,
}: DataTableColumnHeaderProps<TData, TValue>) {
	// --- RENDER ---

	if (!column.getCanSort()) {
		return <div className={cn(className)}>{title}</div>
	}

	return (
		<div className={cn("flex items-center", className)}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="sm" className="m-0 h-8 data-[state=open]:bg-accent">
						<span className="mr-1 text-sm">{title}</span>
						{column.getIsSorted() === "desc" ? (
							<ArrowDown className="h-3.5 w-3.5 text-muted-foreground/70" />
						) : column.getIsSorted() === "asc" ? (
							<ArrowUp className="h-3.5 w-3.5 text-muted-foreground/70" />
						) : (
							<ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground/70" />
						)}
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align="start">
					<DropdownMenuItem onClick={() => column.toggleSorting(false)}>
						<ArrowUp className="h-3.5 w-3.5 text-muted-foreground/70" />
						Asc
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => column.toggleSorting(true)}>
						<ArrowDown className="h-3.5 w-3.5 text-muted-foreground/70" />
						Desc
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => column.clearSorting()}>
						<ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground/70" />
						Remove
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}
