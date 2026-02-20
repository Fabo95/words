"use client"

import { BookOpen } from "lucide-react"
import { useTranslations } from "next-intl"

import { AddTranslationTrigger } from "@app/app/[lang]/(loggedIn)/_content/addTranslationTrigger"
import { EmptyState } from "@app/components/ui/empty-state"

export function TranslationsEmptyState() {
	const t = useTranslations()

	return (
		<EmptyState
			icon={BookOpen}
			title={t("pages.translations.empty.title")}
			description={t("pages.translations.empty.description")}
		>
			<AddTranslationTrigger
				defaultValues={{ universalPosTagIds: [] }}
				variant="default"
				className="gap-2 px-6"
				title={t("pages.translations.empty.cta")}
				size="default"
			/>
		</EmptyState>
	)
}
