"use client"

import { useCallback, useMemo } from "react"
import type { RowSelectionState } from "@tanstack/react-table"

type UseRowSelectionProps = {
	rowSelection?: RowSelectionState
	onRowSelectionChange?: (selection: RowSelectionState) => void
}

export function useRowSelection({ rowSelection, onRowSelectionChange }: UseRowSelectionProps) {
	const isSelectable = rowSelection !== undefined && onRowSelectionChange !== undefined

	const toggleSelection = useCallback(
		(id: number) => {
			if (!onRowSelectionChange || !rowSelection) return
			const key = id.toString()
			const newSelection = { ...rowSelection }
			if (newSelection[key]) {
				delete newSelection[key]
			} else {
				newSelection[key] = true
			}
			onRowSelectionChange(newSelection)
		},
		[onRowSelectionChange, rowSelection],
	)

	const isSelected = useCallback(
		(id: number) => {
			return rowSelection?.[id.toString()] ?? false
		},
		[rowSelection],
	)

	return useMemo(
		() => ({
			isSelectable,
			toggleSelection,
			isSelected,
		}),
		[isSelectable, toggleSelection, isSelected],
	)
}
