"use client"

import * as React from "react"

import { AddTranslationTrigger } from "@app/app/[lang]/(loggedIn)/_content/addTranslationTrigger"
import { useTranslations } from "next-intl"

export function TranslationsEmptyState() {
	const t = useTranslations()

	return (
		<div className="mt-20 mb-10 mx-auto flex max-w-sm flex-col items-center text-center">
			<h3 className="text-base font-semibold leading-tight mb-2">{t("pages.translations.empty.title")}</h3>
			<p className=" text-sm text-muted-foreground">{t("pages.translations.empty.description")}</p>

			<div className="mt-6 w-full">
				<AddTranslationTrigger
					defaultValues={{ universalPosTagIds: [] }}
					variant="outline"
					className="gap-2"
					title={t("pages.translations.empty.cta")}
					size="sm"
				/>
			</div>
		</div>
	)
}
