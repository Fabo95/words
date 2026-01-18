"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { formatRelativeTime } from "@app/utils/time"
import { TranslationActions } from "@app/components/translationActions/translationActions"
import { Badge } from "@app/components/ui/badge"
import { cn } from "@app/utils/shadcn/shadcnHelpers"
import { getCollectionsQueryOptions, getLatestTranslationsQueryOptions } from "@app/utils/reactQuery/queryOptions"
import { useSuspenseQuery } from "@tanstack/react-query"

export function LastAddedTranslation() {
	const t = useTranslations()

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

	return (
		<section>
			<div className="mb-5 text-center">
				<h2 className="text-lg md:text-xl font-semibold">{t("pages.home.lastAddedTranslations.title")}</h2>
				<p className="mt-1 text-sm text-foreground/40">{t("pages.home.lastAddedTranslations.description")}</p>
			</div>

			{data?.length === 0 ? (
				<div className="mx-auto max-w-md rounded-xl border bg-background/40 px-4 py-6 text-center">
					<p className="text-sm text-foreground/60">{t("pages.home.lastAddedTranslations.empty")}</p>
					<p className="mt-1 text-xs text-foreground/40">{t("pages.home.lastAddedTranslations.emptyHint")}</p>
				</div>
			) : (
				<div className="mx-auto max-w-2xl overflow-hidden rounded-xl border bg-background/40">
					<ul className="divide-y">
						{data?.map((translation, index) => {
							const relative = formatRelativeTime(translation.created_at, t)

							const collectionId = translation.collection_id ?? undefined
							const collectionName = typeof collectionId === "number" ? collectionNameById.get(collectionId) : undefined

							return (
								<li
									key={translation.id}
									className={cn(
										"group px-4 py-3 transition-colors",
										"hover:bg-muted/30",
										"focus-within:bg-muted/30",
										index === 0 && "rounded-t-xl",
										index === data.length - 1 && "rounded-b-xl",
									)}
								>
									<div className="flex items-start justify-between gap-4">
										<div className="flex items-start gap-2">
											<div className="min-w-0">
												<p className="text-sm font-semibold leading-5 truncate">{translation.source_text}</p>

												<p className="mt-1 text-sm text-foreground/60 leading-5 truncate">{translation.target_text}</p>
											</div>

											{collectionName ? (
												<div className="flex items-center gap-2">
													<Badge variant="secondary" className="max-w-55 truncate text-xs" title={collectionName}>
														{collectionName}
													</Badge>
												</div>
											) : null}
										</div>

										<div className="shrink-0 flex w-18 flex-col items-end justify-between self-stretch">
											<TranslationActions
												translationId={translation.id}
												sourceText={translation.source_text}
												targetText={translation.target_text}
												cefrLevelId={translation.cefr_level?.id}
												collectionId={collectionId}
											/>

											<p className="text-xs text-foreground/40 tabular-nums">{relative}</p>
										</div>
									</div>
								</li>
							)
						})}
					</ul>
				</div>
			)}
		</section>
	)
}
