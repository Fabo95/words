"use client"

import { useCallback, useMemo } from "react"
import { route } from "@app/i18n/routing"
import { useParams } from "next/navigation"
import { useSearchParamState } from "@app/utils/urls/useSearchParamState"

export type CollectionTableQuery = {
	page?: number | null
	search?: string | null
}

export type CollectionTableQuerySetters = {
	setPage: (page: number | undefined) => void
	setSearch: (search: string | undefined) => void
}

export const CollectionTableQueryy: Record<keyof CollectionTableQuery, string> = {
	page: "page",
	search: "search",
}

interface UseCollectionTableQueryReturn {
	query: CollectionTableQuery
	setters: CollectionTableQuerySetters
}

export function useCollectionTableQuery(): UseCollectionTableQueryReturn {
	const { id } = useParams<{ id: string }>()

	const [rawPage, setRawPage] = useSearchParamState<number>(CollectionTableQueryy.page, "search", "number", "replace")

	const page = rawPage || 1

	const [rawSearch, setRawSearch] = useSearchParamState<string>(
		CollectionTableQueryy.search,
		"search",
		"string",
		"replace",
	)

	// --- QUERY ---

	const query = useMemo<CollectionTableQuery>(
		() => ({
			page,
			search: rawSearch,
		}),
		[rawSearch, page],
	)

	// --- SETTERS ---

	const setPage = useCallback(
		(nextPage: number | undefined) => {
			setRawPage(nextPage, route("/collection/:id").getUrl(id, { ...query, page: nextPage }), {
				scroll: false,
			})
		},
		[query, id, setRawPage],
	)

	const setSearch = useCallback(
		(nextSearch: string | undefined) => {
			setRawSearch(nextSearch, route("/collection/:id").getUrl(id, { ...query, search: nextSearch }), {
				scroll: false,
			})
		},
		[query, id, setRawSearch],
	)

	const setters = useMemo(
		() => ({
			setPage,
			setSearch,
		}),
		[setSearch, setPage],
	)

	// --- RETURN ---

	return useMemo(() => ({ query, setters }), [query, setters])
}
