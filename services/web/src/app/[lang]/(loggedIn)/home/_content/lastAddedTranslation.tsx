"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { formatRelativeTime } from "@app/utils/time"
import { TranslationActions } from "@app/components/translationActions/translationActions"
import { Badge } from "@app/components/ui/badge"
import { Card } from "@app/components/ui/card"
import { getCollectionsQueryOptions, getLatestTranslationsQueryOptions } from "@app/utils/reactQuery/queryOptions"
import { useSuspenseQuery } from "@tanstack/react-query"
import { getCollectionPage } from "@app/utils/urls/urls"
import { useRouter } from "next/navigation"
import { History } from "lucide-react"

export function LastAddedTranslation() {
	const t = useTranslations()
	const router = useRouter()

	const {
		data: { data },
	} = useSuspenseQuery(getLatestTranslationsQueryOptions())

	const {
		data: { data: collections },
	} = useSuspenseQuery(getCollectionsQueryOptions())

	const collectionNameById = React.useMemo(() => {
		const map = new Map<number, string>()
		for (const c of collections ?? []) map.set(c.id, c.name)
		return map
	}, [collections])

	if (!data || data.length === 0) {
		return (
			<section className="mb-8">
				<Card className="p-4 gap-0">
					<div className="flex items-center gap-2 mb-2">
						<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
							<History className="h-4 w-4 text-primary" />
						</div>
						<h2 className="text-sm font-semibold">{t("pages.home.lastAddedTranslations.title")}</h2>
					</div>
					<p className="text-sm text-muted-foreground">{t("pages.home.lastAddedTranslations.empty")}</p>
				</Card>
			</section>
		)
	}

	return (
		<section className="mb-8">
			<Card className="p-4 gap-0">
				<div className="flex items-center gap-2 mb-2">
					<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
						<History className="h-4 w-4 text-primary" />
					</div>
					<h2 className="text-sm font-semibold">{t("pages.home.lastAddedTranslations.title")}</h2>
				</div>
				<ul className="divide-y divide-border/50 -mx-4 border-t border-border/50">
					{data.map((translation) => {
						const relative = formatRelativeTime(translation.created_at, t)

						const collectionId = translation.collection_id ?? undefined
						const collectionName = typeof collectionId === "number" ? collectionNameById.get(collectionId) : undefined

						return (
							<li
								key={translation.id}
								className="group px-4 py-3 transition-colors hover:bg-muted/30 focus-within:bg-muted/30"
							>
								<div className="flex items-start justify-between gap-3 md:gap-4">
									<div className="flex flex-col gap-1.5 md:gap-2 justify-end min-w-0">
										{collectionName && collectionId ? (
											<div className="flex items-center gap-2">
												<Badge
													onClick={() => router.push(getCollectionPage(collectionId))}
													variant="secondary"
													className="max-w-32 md:max-w-55 truncate text-xs cursor-pointer"
													title={collectionName}
												>
													{collectionName}
												</Badge>
											</div>
										) : null}

										<div className="flex flex-col gap-0.5 md:flex-row md:gap-2">
											<p className="text-sm font-semibold leading-5 truncate">{translation.source_text}</p>

											<p className="text-sm text-foreground/60 leading-5 truncate">{translation.target_text}</p>
										</div>
									</div>

									<div className="shrink-0 flex gap-1 flex-col items-end justify-between self-stretch">
										<TranslationActions
											translationId={translation.id}
											sourceText={translation.source_text}
											targetText={translation.target_text}
											cefrLevelId={translation.cefr_level?.id}
											collectionId={collectionId}
											universalPosTagIds={translation.universal_pos_tags.map((universalPosTag) => universalPosTag.id)}
										/>

										<p className="text-xs text-foreground/40 tabular-nums">{relative}</p>
									</div>
								</div>
							</li>
						)
					})}
				</ul>
			</Card>
		</section>
	)
}
