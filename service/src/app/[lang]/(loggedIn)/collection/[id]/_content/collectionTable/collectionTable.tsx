"use client"

import { COLLECTION_TABLE_COLUMNS } from "@app/app/[lang]/(loggedIn)/collection/[id]/_content/collectionTable/utils/collectionTableConstants"
import { DataTable } from "@app/components/ui/dataTable/dataTable"

export const CollectionTable = () => {
	// --- RENDER ---

	return (
		<div className="container mx-auto py-10">
			<DataTable
				filters={[
					{ value: "sourceText", label: "Wort" },
					{ value: "targetText", label: "Übersetzung" },
				]}
				columns={COLLECTION_TABLE_COLUMNS}
				data={[
					{
						id: 123,
						translationId: 321,
						sourceLanguage: "deutsch",
						sourceText: "he",
						targetLanguage: "englisch",
						targetText: "hu",
					},
					{
						id: 444,
						translationId: 443,
						sourceLanguage: "x",
						sourceText: "he",
						targetLanguage: "englisch",
						targetText: "hu",
					},
				]}
			/>
		</div>
	)
}
