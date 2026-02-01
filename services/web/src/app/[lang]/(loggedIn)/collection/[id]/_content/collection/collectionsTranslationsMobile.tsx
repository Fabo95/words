"use client"

import * as React from "react"
import { useTranslations } from "next-intl"

import { Badge } from "@app/components/ui/badge"
import { Card, CardContent, CardHeader } from "@app/components/ui/card"

import { CollectionTranslation } from "@app/app/[lang]/(loggedIn)/collection/[id]/_content/collection/utils/collectionTableTypes"
import { TranslationActions } from "@app/components/translationActions/translationActions"

type CollectionsTranslationsMobileProps = {
	items: CollectionTranslation[]
}

export function CollectionsTranslationsMobile({ items }: CollectionsTranslationsMobileProps) {
	const t = useTranslations()

	if (!items?.length) {
		return (
			<Card className="rounded-xl">
				<CardContent className="py-8 text-sm text-muted-foreground">
					{t("pages.collection.table.emptyState", { default: "No results." })}
				</CardContent>
			</Card>
		)
	}

	return (
		<div className="space-y-3">
			{items.map((item) => {
				const cefrCode = item.cefrLevel?.code
				const posTags = item.universalPosTags ?? []
				const posPrimary = posTags[0]

				return (
					<Card key={item.translationId} className="rounded-xl gap-3">
						<CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
							<div className="flex flex-wrap items-center gap-2">
								{cefrCode ? (
									<Badge variant="secondary" className="text-xs">
										{cefrCode}
									</Badge>
								) : null}

								{posPrimary ? (
									<Badge variant="secondary" className="text-xs">
										{t(`common.posTags.${posPrimary.code}`)}
										{posTags.length > 1 ? ` +${posTags.length - 1}` : ""}
									</Badge>
								) : null}
							</div>

							<div className="shrink-0">
								<TranslationActions
									collectionId={item.id}
									translationId={item.translationId}
									sourceText={item.sourceText}
									targetText={item.targetText}
									cefrLevelId={item.cefrLevel?.id}
									universalPosTagIds={item.universalPosTags.map((universalPosTag) => universalPosTag.id)}
								/>
							</div>
						</CardHeader>

						<CardContent className="pt-0">
							<div className="space-y-3 flex gap-10">
								<div>
									<p className="text-xs text-muted-foreground">{t("pages.collection.table.columns.word")}</p>
									<p className="mt-1 font-medium break-words">{item.sourceText}</p>
								</div>

								<div>
									<p className="text-xs text-muted-foreground">{t("pages.collection.table.columns.translation")}</p>
									<p className="mt-1 break-words">{item.targetText}</p>
								</div>
							</div>
						</CardContent>
					</Card>
				)
			})}
		</div>
	)
}
