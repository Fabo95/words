"use client"

import { useCallback, useMemo } from "react"
import { useSearchParamState } from "@app/utils/urls/useSearchParamState"

export type TranslationsTableQuery = {
	page?: number | null
	search?: string | null
}

export type TranslationsTableQuerySetters = {
	setPage: (page: number | undefined) => void
	setSearch: (search: string | undefined) => void
}

export const TranslationsTableQueryKeys: Record<keyof TranslationsTableQuery, string> = {
	page: "page",
	search: "search",
}

interface UseTranslationsTableQueryReturn {
	query: TranslationsTableQuery
	setters: TranslationsTableQuerySetters
}

export function useTranslationsTableQuery(): UseTranslationsTableQueryReturn {
	const [rawPage, setRawPage] = useSearchParamState<number>(TranslationsTableQueryKeys.page, "search", "number", "replace")

	const page = rawPage || 1

	const [rawSearch, setRawSearch] = useSearchParamState<string>(
		TranslationsTableQueryKeys.search,
		"search",
		"string",
		"replace",
	)

	// --- QUERY ---

	const query = useMemo<TranslationsTableQuery>(
		() => ({
			page,
			search: rawSearch,
		}),
		[rawSearch, page],
	)

	// --- SETTERS ---

	const setPage = useCallback(
		(nextPage: number | undefined) => {
			const searchParams = new URLSearchParams()
			if (query.search) searchParams.append(TranslationsTableQueryKeys.search, query.search)
			if (nextPage) searchParams.append(TranslationsTableQueryKeys.page, String(nextPage))
			const queryString = searchParams.toString()
			const url = queryString ? `/translations?${queryString}` : "/translations"

			setRawPage(nextPage, url, { scroll: false })
		},
		[query, setRawPage],
	)

	const setSearch = useCallback(
		(nextSearch: string | undefined) => {
			setPage(1)

			const searchParams = new URLSearchParams()
			if (nextSearch) searchParams.append(TranslationsTableQueryKeys.search, nextSearch)
			searchParams.append(TranslationsTableQueryKeys.page, "1")
			const queryString = searchParams.toString()
			const url = queryString ? `/translations?${queryString}` : "/translations"

			setRawSearch(nextSearch, url, { scroll: false })
		},
		[setRawSearch, setPage],
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
