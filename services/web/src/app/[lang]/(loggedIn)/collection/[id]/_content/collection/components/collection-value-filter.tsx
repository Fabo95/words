"use client"

import { ChangeEvent, useCallback, useMemo, useState } from "react"
import { debounce } from "next/dist/server/utils"
import { Input } from "@app/components/ui/input"

type VouchersValueFilterProps = {
	isDisabled?: boolean
	value?: string
	setValue: (value: string | undefined) => void
}

export const CollectionStringFilter = ({ isDisabled, value, setValue }: VouchersValueFilterProps) => {
	const [searchInput, setSearchInput] = useState(value)

	// --- MEMOIZED DATA ---

	const debouncedSetValue = useMemo(() => debounce(setValue, 150), [setValue])

	// --- CALLBACKS ---

	const onChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const value = event.target.value

			setSearchInput(value ?? undefined)

			const isInitialValue = !searchInput && value.length === 1

			// When the user types the first character, we want to fetch results immediately
			// This is to make the search feel more responsive and to let the user know that the search is working
			// without having to click a button
			if (isInitialValue) {
				setValue(value ?? undefined)
			} else {
				debouncedSetValue(value ?? undefined)
			}
		},
		[debouncedSetValue, searchInput, setValue],
	)

	// --- RENDER ---

	return (
		<Input
			disabled={isDisabled}
			placeholder="e.g. h"
			value={searchInput ?? ""}
			onChange={onChange}
			className="w-[300px] mb-3"
		/>
	)
}
