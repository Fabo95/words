"use client"

import * as React from "react"
import { useTranslations } from "next-intl"

import { Badge } from "@app/components/ui/badge"
import { Card, CardContent, CardHeader } from "@app/components/ui/card"
import { Skeleton } from "@app/components/ui/skeleton"

import { TranslationActions } from "@app/components/translationActions/translationActions"
import { TranslationsTableItem } from "@app/app/[lang]/(loggedIn)/translations/_content/utils/translationsTableTypes"

type TranslationsMobileProps = {
	items: TranslationsTableItem[]
	isLoading?: boolean
	skeletonRowCount?: number
}

export function TranslationsMobile({ items, isLoading, skeletonRowCount = 5 }: TranslationsMobileProps) {
	const t = useTranslations()

	if (isLoading) {
		return (
			<div className="space-y-3">
				{Array.from({ length: skeletonRowCount }).map((_, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: skeleton cards are static
					<Card key={`skeleton-${index}`} className="rounded-xl gap-3 h-37.5">
						<CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
							<div className="flex flex-wrap items-center gap-2">
								<Skeleton className="h-5 w-16" />
								<Skeleton className="h-5 w-12" />
							</div>
							<Skeleton className="h-8 w-8 rounded" />
						</CardHeader>
						<CardContent className="pt-0">
							<div className="flex gap-10">
								<div className="flex-1">
									<Skeleton className="h-3 w-10 mb-2" />
									<Skeleton className="h-5 w-24" />
								</div>
								<div className="flex-1">
									<Skeleton className="h-3 w-16 mb-2" />
									<Skeleton className="h-5 w-28" />
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		)
	}

	if (!items?.length) {
		return (
			<Card className="rounded-xl">
				<CardContent className="py-8 text-sm text-muted-foreground">
					{t("pages.translations.table.emptyState")}
				</CardContent>
			</Card>
		)
	}

	return (
		<div className="space-y-3">
			{items.map((item) => {
				const cefrCode = item.cefrLevel?.code
				const posNames = item.universalPosTags?.map((tag) => tag.name) ?? []
				const posPrimary = posNames[0]

				return (
					<Card key={item.translationId} className="rounded-xl gap-3">
						<CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
							<div className="flex flex-wrap items-center gap-2">
								{item.collectionName ? (
									<Badge variant="secondary" className="text-xs max-w-32 truncate">
										{item.collectionName}
									</Badge>
								) : null}

								{cefrCode ? (
									<Badge variant="secondary" className="text-xs">
										{cefrCode}
									</Badge>
								) : null}

								{posPrimary ? (
									<Badge variant="secondary" className="text-xs">
										{posPrimary}
										{posNames.length > 1 ? ` +${posNames.length - 1}` : ""}
									</Badge>
								) : null}
							</div>

							<div className="shrink-0">
								<TranslationActions
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
									<p className="text-xs text-muted-foreground">{t("pages.translations.table.columns.word")}</p>
									<p className="mt-1 font-medium break-words">{item.sourceText}</p>
								</div>

								<div>
									<p className="text-xs text-muted-foreground">{t("pages.translations.table.columns.translation")}</p>
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
