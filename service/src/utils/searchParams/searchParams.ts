import { ReadonlyURLSearchParams } from "next/dist/client/components/navigation"

export const createSearchParams = (
	keyValuePairs: Record<string, string | boolean | number>,
	searchParams?: ReadonlyURLSearchParams,
) => {
	const params = new URLSearchParams(searchParams)

	// biome-ignore lint/complexity/noForEach: <explanation>
	Object.entries(keyValuePairs).forEach(([key, value]) => {
		if (params.has(key)) {
			params.delete(key)
		}

		params.set(key, String(value))
	})

	return params.toString()
}

export const deleteSearchParams = ({
	keysToDelete,
	searchParams,
}: {
	keysToDelete: string[]
	searchParams: ReadonlyURLSearchParams
}) => {
	const params = new URLSearchParams(searchParams)

	// biome-ignore lint/complexity/noForEach: <explanation>
	keysToDelete.forEach((key) => {
		params.delete(key)
	})

	return params.toString()
}
