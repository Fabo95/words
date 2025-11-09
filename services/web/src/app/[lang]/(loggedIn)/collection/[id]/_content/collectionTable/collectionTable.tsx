"use client"

import { COLLECTION_TABLE_COLUMNS } from "@app/app/[lang]/(loggedIn)/collection/[id]/_content/collectionTable/utils/collectionTableConstants"
import { CollectionTranslation } from "@app/app/[lang]/(loggedIn)/collection/[id]/_content/collectionTable/utils/collectionTableTypes"
import { DataTable } from "@app/components/ui/dataTable/dataTable"
import { $api } from "@app/utils/api/apiRequests"
import { useParams } from "next/navigation"
import { useMemo } from "react"
import * as React from "react"
import { useTranslations } from "next-intl"
import { TranslationDetails } from "@app/utils/entities/translationDetails"
import { TranslationDetailsDialog } from "@app/components/dialogs/translationDetailsDialog"

export const CollectionTable = () => {
	// --- STATE ---

	const t = useTranslations()

	const params = useParams<{ id: string }>()

	const [selectedRow, setSelectedRow] = React.useState<TranslationDetails>()

	const {
		data: { response_object },
	} = $api.useSuspenseQuery("get", "/collection/{id}/translations", {
		params: { path: { id: Number(params.id) } },
	})

	const { data } = $api.useSuspenseQuery("get", "/collection/test/{id}", {
		params: { path: { id: Number(params.id) } },
	})

	console.log("response_object,,", response_object)

	// --- MEMOIZED DATA ---

	const tableData: CollectionTranslation[] = useMemo(() => {
		if (!response_object) {
			return []
		}

		return response_object.map((translation) => ({
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
	}, [response_object, params.id])

	// --- RENDER ---

	return (
		<>
			<div className="w-4/5 overflow-hidden">
				<h1>{data.response_object?.name}</h1>

				<DataTable
					filters={[
						{ value: "sourceText", label: "Wort" },
						{ value: "targetText", label: "Übersetzung" },
					]}
					columns={COLLECTION_TABLE_COLUMNS}
					data={tableData}
					onRowClick={(row) => setSelectedRow(row)}
				/>
			</div>
			{selectedRow && (
				<TranslationDetailsDialog
					translationDetails={selectedRow}
					isOpen={Boolean(selectedRow)}
					onOpenChange={(isOpen) => setSelectedRow(isOpen ? selectedRow : undefined)}
				/>
			)}
			)
		</>
	)
}
