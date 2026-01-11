"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { $api } from "@app/utils/api/apiRequests"
import { formatRelativeTime } from "@app/utils/time"

export function LastAddedTranslation() {
	const t = useTranslations()

	const {
		data: { data },
	} = $api.useSuspenseQuery("get", "/translation", {
		params: {
			query: {
				page_size: 3,
				sort_by: "created_at",
				sort_order: "desc",
			},
		},
	})

	return (
		<section>
			<h1 className="text-center text-xl font-semibold">{t("pages.home.lastAddedTranslations.title")}</h1>

			<p className="text-center text-sm font-medium text-foreground/40 mb-4">
				{t("pages.home.lastAddedTranslations.description")}
			</p>

			{data?.length === 0 ? (
				<div className="mx-auto max-w-md rounded-xl border bg-background/40 px-4 py-6 text-center">
					<p className="text-sm text-foreground/60">{t("pages.home.lastAddedTranslations.empty")}</p>
					<p className="mt-1 text-xs text-foreground/40">{t("pages.home.lastAddedTranslations.emptyHint")}</p>
				</div>
			) : (
				<div className="mx-auto max-w-2xl overflow-hidden rounded-xl border bg-background/40">
					<ul className="divide-y">
						{data?.map((translation) => {
							const relative = formatRelativeTime(translation.created_at, t)

							return (
								<li key={translation.id} className="group px-4 py-3 transition-colors">
									<div className="flex items-start justify-between gap-3">
										<div className="min-w-0">
											<p className="font-medium truncate">{translation.source_text}</p>
											<p className="text-sm text-foreground/60 truncate">{translation.target_text}</p>
										</div>

										{/* right: time */}
										<div className="shrink-0 text-right">
											<p className="text-xs font-medium text-foreground/40">{relative}</p>
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
