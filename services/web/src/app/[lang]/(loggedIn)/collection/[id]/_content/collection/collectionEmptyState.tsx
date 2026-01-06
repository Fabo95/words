"use client"

import * as React from "react"
import { Plus } from "lucide-react"

import { Button } from "@app/components/ui/button"
import { Card, CardContent } from "@app/components/ui/card"
import { AddTranslationTrigger } from "@app/app/[lang]/(loggedIn)/_content/addTranslationTrigger"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"

export function CollectionEmptyState() {
	const t = useTranslations()

	const params = useParams<{ id: string }>()

	return (
		<div className="mt-20 mb-10 mx-auto flex max-w-sm flex-col items-center text-center">
			<h3 className="text-base font-semibold leading-tight mb-2">{t("pages.collection.empty.title")}</h3>
			<p className=" text-sm text-muted-foreground">{t("pages.collection.empty.description")}</p>

			<div className="mt-6 w-full">
				<AddTranslationTrigger
					defaultValues={{ collectionId: Number(params.id) }}
					variant="outline"
					className="gap-2"
					title={t("pages.collection.empty.cta")}
					size="sm"
				/>
			</div>
		</div>
	)
}
