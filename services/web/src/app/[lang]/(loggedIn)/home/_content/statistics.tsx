"use client"

import { useTranslations } from "next-intl"
import { getTranslationStatisticsQueryOptions } from "@app/utils/reactQuery/queryOptions"
import { useSuspenseQuery } from "@tanstack/react-query"
import { BarChart3, BookOpen } from "lucide-react"

export function Statistics() {
	const t = useTranslations()

	const {
		data: { data },
	} = useSuspenseQuery(getTranslationStatisticsQueryOptions())

	return (
		<section className="mb-12">
			<div className="mb-5 text-center">
				<div className="flex justify-center mb-3">
					<div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-primary/10">
						<BarChart3 className="h-5 w-5 md:h-6 md:w-6 text-primary" />
					</div>
				</div>
				<h2 className="text-lg md:text-xl font-semibold">{t("pages.home.statistics.title")}</h2>
				<p className="mt-1 text-sm text-foreground/40">{t("pages.home.statistics.description")}</p>
			</div>

			<div className="mx-auto max-w-2xl overflow-hidden rounded-xl border bg-background/40">
				<div className="px-4 py-4">
					<div className="flex items-center justify-between border-b pb-3 mb-3">
						<div className="flex items-center gap-2">
							<BookOpen className="h-4 w-4 text-foreground/60" />
							<span className="text-sm text-foreground/60">{t("pages.home.statistics.totalTranslations")}</span>
						</div>
						<span className="text-lg font-semibold tabular-nums">{data?.total_translations ?? 0}</span>
					</div>

					{data?.words_per_pos_tag && data.words_per_pos_tag.length > 0 && (
						<div>
							<span className="text-sm text-foreground/60">{t("pages.home.statistics.wordsByPosTag")}</span>
							<ul className="mt-2 space-y-2">
								{data.words_per_pos_tag.map((item) => {
									if (item.count < 1) return

									return (
										<li key={item.universal_pos_tag_id} className="flex items-center justify-between">
											<span className="text-sm">{t(`common.posTags.${item.code}`)}</span>
											<span className="text-sm tabular-nums text-foreground/60">{item.count}</span>
										</li>
									)
								})}
							</ul>
						</div>
					)}
				</div>
			</div>
		</section>
	)
}
