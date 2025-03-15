"use client"

import { COLLECTION_TABLE_COLUMNS } from "@app/app/[lang]/(loggedIn)/collection/[id]/_content/collectionTable/utils/collectionTableConstants"
import { CollectionTranslation } from "@app/app/[lang]/(loggedIn)/collection/[id]/_content/collectionTable/utils/collectionTableTypes"
import { DataTable } from "@app/components/ui/dataTable/dataTable"
import { $api } from "@app/utils/api/apiRequests"
import { useParams } from "next/navigation"
import { useMemo } from "react"

export const CollectionTable = () => {
	// --- STATE ---

	const params = useParams<{ id: string }>()

	const {
		data: { response_object },
	} = $api.useSuspenseQuery("get", "/collection/{id}/translations", {
		params: { path: { id: Number(params.id) } },
	})

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
		}))
	}, [response_object, params.id])

	// --- RENDER ---

	return (
		<div className="w-4/5 overflow-hidden">
			<DataTable
				filters={[
					{ value: "sourceText", label: "Wort" },
					{ value: "targetText", label: "Übersetzung" },
				]}
				columns={COLLECTION_TABLE_COLUMNS}
				data={tableData}
			/>
		</div>
	)
}
