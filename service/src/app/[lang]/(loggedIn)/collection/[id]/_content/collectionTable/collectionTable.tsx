"use client"

import { COLLECTION_TABLE_COLUMNS } from "@app/app/[lang]/(loggedIn)/collection/[id]/_content/collectionTable/utils/collectionTableConstants"
import { DataTable } from "@app/components/ui/dataTable/dataTable"

export const CollectionTable = () => {
	// --- RENDER ---

	return (
		<div className="container mx-auto py-10">
			<DataTable
				filters={["sourceText", "targetText"]}
				columns={COLLECTION_TABLE_COLUMNS}
				data={[
					{ sourceLanguage: "deutsch", sourceText: "he", targetLanguage: "englisch", targetText: "hu" },
					{ sourceLanguage: "x", sourceText: "he", targetLanguage: "englisch", targetText: "hu" },
					{ sourceLanguage: "deutsch", sourceText: "he", targetLanguage: "englisch", targetText: "hu" },
					{ sourceLanguage: "x", sourceText: "he", targetLanguage: "englisch", targetText: "hu" },
					{ sourceLanguage: "deutsch", sourceText: "he", targetLanguage: "englisch", targetText: "hu" },
					{ sourceLanguage: "x", sourceText: "he", targetLanguage: "englisch", targetText: "hu" },
					{ sourceLanguage: "deutsch", sourceText: "he", targetLanguage: "englisch", targetText: "hu" },
					{ sourceLanguage: "x", sourceText: "he", targetLanguage: "englisch", targetText: "hu" },
					{ sourceLanguage: "deutsch", sourceText: "he", targetLanguage: "englisch", targetText: "hu" },
					{ sourceLanguage: "x", sourceText: "he", targetLanguage: "englisch", targetText: "hu" },
					{ sourceLanguage: "deutsch", sourceText: "he", targetLanguage: "englisch", targetText: "hu" },
					{ sourceLanguage: "x", sourceText: "he", targetLanguage: "englisch", targetText: "hu" },
					{ sourceLanguage: "deutsch", sourceText: "he", targetLanguage: "englisch", targetText: "hu" },
					{ sourceLanguage: "x", sourceText: "he", targetLanguage: "englisch", targetText: "hu" },
					{ sourceLanguage: "deutsch", sourceText: "he", targetLanguage: "englisch", targetText: "hu" },
					{ sourceLanguage: "x", sourceText: "he", targetLanguage: "englisch", targetText: "hu" },
					{ sourceLanguage: "deutsch", sourceText: "he", targetLanguage: "englisch", targetText: "hu" },
					{ sourceLanguage: "x", sourceText: "he", targetLanguage: "englisch", targetText: "hu" },
					{ sourceLanguage: "deutsch", sourceText: "he", targetLanguage: "englisch", targetText: "hu" },
					{ sourceLanguage: "x", sourceText: "he", targetLanguage: "englisch", targetText: "hu" },
					{ sourceLanguage: "deutsch", sourceText: "he", targetLanguage: "englisch", targetText: "hu" },
					{ sourceLanguage: "x", sourceText: "he", targetLanguage: "englisch", targetText: "hu" },
					{ sourceLanguage: "deutsch", sourceText: "he", targetLanguage: "englisch", targetText: "hu" },
					{ sourceLanguage: "x", sourceText: "he", targetLanguage: "englisch", targetText: "hu" },
					{ sourceLanguage: "deutsch", sourceText: "he", targetLanguage: "englisch", targetText: "hu" },
					{ sourceLanguage: "x", sourceText: "he", targetLanguage: "englisch", targetText: "hu" },
					{ sourceLanguage: "deutsch", sourceText: "he", targetLanguage: "englisch", targetText: "hu" },
					{ sourceLanguage: "x", sourceText: "he", targetLanguage: "englisch", targetText: "hu" },
				]}
			/>
		</div>
	)
}
