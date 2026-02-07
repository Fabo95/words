"use client"

import { getCollectionTableColumns } from "@app/app/[lang]/(loggedIn)/collection/[id]/_content/collection/utils/collectionTableConstants"
import { CollectionTranslation } from "@app/app/[lang]/(loggedIn)/collection/[id]/_content/collection/utils/collectionTableTypes"
import { DataTable } from "@app/components/ui/dataTable/dataTable"
import { useParams } from "next/navigation"
import { useCallback, useMemo } from "react"
import * as React from "react"
import { useTranslations } from "next-intl"
import { useCollectionTableQuery } from "@app/app/[lang]/(loggedIn)/collection/[id]/_content/collection/utils/collectionTableQuery"
import { CollectionStringFilter } from "@app/app/[lang]/(loggedIn)/collection/[id]/_content/collection/components/collection-value-filter"
import { Button } from "@app/components/ui/button"
import { useIsMobile } from "@app/hooks/use-mobile"
import { CollectionsTranslationsMobile } from "@app/app/[lang]/(loggedIn)/collection/[id]/_content/collection/collectionsTranslationsMobile"
import { CollectionEmptyState } from "@app/app/[lang]/(loggedIn)/collection/[id]/_content/collection/collectionEmptyState"
import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import {
	getCollectionByIdQueryOptions,
	getCollectionTranslationsQueryOptions,
	getTranslationsQueryOptions,
} from "@app/utils/reactQuery/queryOptions"
import { useTranslationsPageSize } from "@app/app/[lang]/(loggedIn)/translations/_content/utils/useTranslationsPageSize"
import { TranslationsMobile } from "@app/app/[lang]/(loggedIn)/translations/_content/translationsMobile"

export const CollectionTranslations = () => {
	// --- STATE ---

	const { query, setters } = useCollectionTableQuery()

	const t = useTranslations()

	const isMobile = useIsMobile()

	const params = useParams<{ id: string }>()

	const pageSize = useTranslationsPageSize()

	const { data: collectionData } = useSuspenseQuery(getCollectionByIdQueryOptions(Number(params.id)))

	const { data: isEmpty } = useSuspenseQuery({
		...getCollectionTranslationsQueryOptions({
			id: Number(params.id),
			page: 1,
			pageSize: 1,
		}),
		select: (translations) => translations.data?.length === 0,
	})

	const { data: translationsData, isFetching } = useQuery(
		getCollectionTranslationsQueryOptions({
			id: Number(params.id),
			page: query.page ?? 1,
			search: query.search ?? undefined,
			pageSize,
		}),
	)

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

	const collectionTranslations: CollectionTranslation[] = useMemo(() => {
		if (!translationsData || !translationsData.data) {
			return []
		}

		return translationsData.data.map((translation) => ({
			id: Number(params.id),
			translationId: translation.id,
			sourceLanguage: translation.source_language,
			sourceText: translation.source_text,
			targetLanguage: translation.target_language,
			targetText: translation.target_text,
			cefrLevel: translation.cefr_level ?? undefined,
			universalPosTags: translation.universal_pos_tags,
			exampleSentences: translation.example_sentences,
			learningProgress: translation.learning_progress ?? undefined,
		}))
	}, [translationsData, params.id])

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
				<h1 className="text-2xl mb-6 md:text-4xl md:mb-8 font-semibold tracking-tight">{collectionData.data?.name}</h1>

				<CollectionStringFilter
					isDisabled={!collectionTranslations.length && !query.search}
					value={query.search ?? undefined}
					setValue={setters.setSearch}
				/>

				{isEmpty && <CollectionEmptyState />}

				{!isMobile && !isEmpty && (
					<DataTable
						columns={getCollectionTableColumns(t)}
						data={collectionTranslations}
						isLoading={isFetching}
						skeletonRowCount={pageSize}
					/>
				)}

				{isMobile && !isEmpty && (
					<TranslationsMobile items={collectionTranslations} isLoading={isFetching} skeletonRowCount={pageSize} />
				)}

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
			</div>
		</>
	)
}
