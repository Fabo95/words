"use client"

import { FolderOpen } from "lucide-react"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"

import { AddTranslationTrigger } from "@app/app/[lang]/(loggedIn)/_content/addTranslationTrigger"
import { EmptyState } from "@app/components/ui/empty-state"

export function CollectionEmptyState() {
	const t = useTranslations()
	const params = useParams<{ id: string }>()

	return (
		<EmptyState
			icon={FolderOpen}
			title={t("pages.collection.empty.title")}
			description={t("pages.collection.empty.description")}
		>
			<AddTranslationTrigger
				defaultValues={{ collectionId: Number(params.id), universalPosTagIds: [] }}
				variant="outline"
				className="gap-2"
				title={t("pages.collection.empty.cta")}
				size="sm"
			/>
		</EmptyState>
	)
}
