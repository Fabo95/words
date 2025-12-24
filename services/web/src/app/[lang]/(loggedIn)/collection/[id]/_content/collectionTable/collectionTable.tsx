"use client"

import { getCollectionTableColumns } from "@app/app/[lang]/(loggedIn)/collection/[id]/_content/collectionTable/utils/collectionTableConstants"
import { CollectionTranslation } from "@app/app/[lang]/(loggedIn)/collection/[id]/_content/collectionTable/utils/collectionTableTypes"
import { DataTable } from "@app/components/ui/dataTable/dataTable"
import { $api } from "@app/utils/api/apiRequests"
import { useParams } from "next/navigation"
import { useCallback, useMemo } from "react"
import * as React from "react"
import { useTranslations } from "next-intl"
import { useCollectionTableQuery } from "@app/app/[lang]/(loggedIn)/collection/[id]/_content/collectionTable/utils/collectionTableQuery"
import { CollectionStringFilter } from "@app/app/[lang]/(loggedIn)/collection/[id]/_content/collectionTable/components/collection-value-filter"
import { run } from "@app/utils/functions/run"
import { Button } from "@app/components/ui/button"

export const CollectionTable = () => {
	// --- STATE ---

	const { query, setters } = useCollectionTableQuery()

	const t = useTranslations()

	const params = useParams<{ id: string }>()

	const { data: translationsData } = $api.useQuery(
		"get",
		"/collection/{id}/translations",
		{
			params: {
				path: { id: Number(params.id) },
				query: { page: query.page ?? 1, page_size: 20, search: query.search ?? undefined },
			},
		},
		{ placeholderData: (prev) => prev },
	)

	const { data: collectionData } = $api.useSuspenseQuery("get", "/collection/wip2/{id}", {
		params: { path: { id: Number(params.id) } },
	})

	const makeOnPaginationChange = useCallback(
		(direction: "next" | "prev") => () => {
			switch (direction) {
				case "next":
					setters.setPage(query.page + 1)
					break

				case "prev":
					setters.setPage(Math.max(query.page - 1, 0))
					break
			}
		},
		[setters, query.page],
	)

	// --- MEMOIZED DATA ---

	const tableData: CollectionTranslation[] = useMemo(() => {
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
		}))
	}, [translationsData, params.id])

	// --- RENDER ---

	return (
		<>
			<div className="w-4/5 overflow-hidden">
				<h1 className="mb-8">{collectionData.data?.name}</h1>

				<CollectionStringFilter value={query.search ?? undefined} setValue={setters.setSearch} />

				<DataTable columns={getCollectionTableColumns(t)} data={tableData} />

				<div className="flex items-center justify-between space-x-2 py-4">
					<div>
						<p className="text-[12px] text-foreground/40 font-normal">
							{run(() => {
								if (!translationsData || !translationsData.meta?.page_size) {
									return null
								}

								const start = translationsData.meta?.page_size * (translationsData.meta.page - 1) + 1
								const end = Math.min(
									translationsData.meta.page_size * translationsData.meta.page,
									translationsData.meta.total_items,
								)

								return (
									<span>
										Showing results{" "}
										<span className="font-medium text-foreground/80">
											{start} – {end}
										</span>{" "}
										of <span className="font-medium text-foreground/80">{translationsData.meta.total_items} total</span>
									</span>
								)
							})}
						</p>
					</div>

					<div className="space-x-2">
						<Button
							variant="outline"
							size="sm"
							disabled={(query.page ?? 1) <= 1}
							onClick={makeOnPaginationChange("prev")}
						>
							Previous
						</Button>

						<Button
							variant="outline"
							size="sm"
							disabled={(translationsData?.meta?.total_items ?? 0) <= (translationsData?.meta?.page ?? 1) * 20}
							onClick={makeOnPaginationChange("next")}
						>
							Next
						</Button>
					</div>
				</div>
			</div>
		</>
	)
}
