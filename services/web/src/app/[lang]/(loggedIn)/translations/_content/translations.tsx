"use client"

import { getTranslationsTableColumns } from "@app/app/[lang]/(loggedIn)/translations/_content/utils/translationsTableConstants"
import { TranslationsTableItem } from "@app/app/[lang]/(loggedIn)/translations/_content/utils/translationsTableTypes"
import { DataTable } from "@app/components/ui/dataTable/dataTable"
import { useCallback, useMemo } from "react"
import * as React from "react"
import { useTranslations } from "next-intl"
import { useTranslationsTableQuery } from "@app/app/[lang]/(loggedIn)/translations/_content/utils/translationsTableQuery"
import { CollectionStringFilter } from "@app/app/[lang]/(loggedIn)/collection/[id]/_content/collection/components/collection-value-filter"
import { Button } from "@app/components/ui/button"
import { useIsMobile } from "@app/hooks/use-mobile"
import { TranslationsMobile } from "@app/app/[lang]/(loggedIn)/translations/_content/translationsMobile"
import { TranslationsEmptyState } from "@app/app/[lang]/(loggedIn)/translations/_content/translationsEmptyState"
import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { getCollectionsQueryOptions, getTranslationsQueryOptions } from "@app/utils/reactQuery/queryOptions"
import { useRouter } from "next/navigation"
import { useTranslationsPageSize } from "@app/app/[lang]/(loggedIn)/translations/_content/utils/useTranslationsPageSize"

export const Translations = () => {
	// --- STATE ---

	const { query, setters } = useTranslationsTableQuery()

	const router = useRouter()

	const t = useTranslations()

	const isMobile = useIsMobile()

	const pageSize = useTranslationsPageSize()

	const { data: isEmpty } = useSuspenseQuery({
		...getTranslationsQueryOptions({
			page: 1,
			pageSize: 1,
		}),
		select: (translations) => translations.data?.length === 0,
	})

	const {
		data: { data: collections },
	} = useSuspenseQuery(getCollectionsQueryOptions())

	const { data: translationsData, isFetching } = useQuery(
		getTranslationsQueryOptions({
			page: query.page ?? 1,
			search: query.search ?? undefined,
			pageSize,
		}),
	)

	const collectionNameById = useMemo(() => {
		const map = new Map<number, string>()
		for (const c of collections ?? []) map.set(c.id, c.name)
		return map
	}, [collections])

	const makeOnPaginationChange = useCallback(
		(direction: "next" | "prev") => () => {
			switch (direction) {
				case "next":
					window.scrollTo({ top: 0, behavior: "instant" })

					setters.setPage((query.page ?? 1) + 1)
					break

				case "prev":
					window.scrollTo({ top: 0, behavior: "instant" })

					setters.setPage(Math.max((query.page ?? 1) - 1, 0))
					break
			}
		},
		[setters, query.page],
	)

	// --- MEMOIZED DATA ---

	const translations: TranslationsTableItem[] = useMemo(() => {
		if (!translationsData || !translationsData.data) {
			return []
		}

		return translationsData.data.map((translation) => {
			const collectionId = translation.collection_id ?? undefined
			const collectionName = typeof collectionId === "number" ? collectionNameById.get(collectionId) : undefined

			return {
				translationId: translation.id,
				sourceText: translation.source_text,
				targetText: translation.target_text,
				collectionId,
				collectionName,
				cefrLevel: translation.cefr_level ?? undefined,
				universalPosTags: translation.universal_pos_tags ?? [],
				exampleSentences: translation.example_sentences ?? [],
				learningProgress: translation.learning_progress ?? undefined,
			}
		})
	}, [translationsData, collectionNameById])

	const pagination = useMemo(() => {
		if (!translationsData || !translationsData.meta?.page_size) {
			return null
		}

		const start = translationsData.meta.total_items
			? translationsData.meta.page_size * (translationsData.meta.page - 1) + 1
			: 0

		const end = Math.min(
			translationsData.meta.page_size * translationsData.meta.page,
			translationsData.meta.total_items,
		)

		return t.rich("pagination.summary", {
			start,
			end,
			totalItems: translationsData.meta.total_items,
			range: (chunks) => <span className="font-medium text-foreground/80">{chunks}</span>,
			total: (chunks) => <span className="font-medium text-foreground/80">{chunks}</span>,
		})
	}, [translationsData, t.rich])

	// --- RENDER ---

	return (
		<>
			<div className="w-full md:w-4/5 overflow-hidden">
				<h1 className="text-xl md:text-2xl mb-4 font-semibold tracking-tight">{t("pages.translations.title")}</h1>

				<CollectionStringFilter
					isDisabled={!translations.length && !query.search}
					value={query.search ?? undefined}
					setValue={setters.setSearch}
				/>

				{isEmpty && <TranslationsEmptyState />}

				{!isMobile && !isEmpty && (
					<DataTable
						columns={getTranslationsTableColumns(t, router)}
						data={translations}
						isLoading={isFetching}
						skeletonRowCount={pageSize}
					/>
				)}

				{isMobile && !isEmpty && <TranslationsMobile items={translations} isLoading={isFetching} skeletonRowCount={pageSize} />}

				{!isEmpty && (
					<div className="flex items-center justify-between space-x-2 py-4">
						<div>
							<p className="text-[12px] text-foreground/40 font-normal">{pagination}</p>
						</div>

						<div className="flex gap-1">
							<Button
								variant="outline"
								size="sm"
								disabled={(query.page ?? 1) <= 1}
								onClick={makeOnPaginationChange("prev")}
							>
								{t("pagination.previous")}
							</Button>

							<Button
								variant="outline"
								size="sm"
								disabled={(translationsData?.meta?.total_items ?? 0) <= (translationsData?.meta?.page ?? 1) * pageSize}
								onClick={makeOnPaginationChange("next")}
							>
								{t("pagination.next")}
							</Button>
						</div>
					</div>
				)}
			</div>
		</>
	)
}
