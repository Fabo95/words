"use client"

import { useTranslations } from "next-intl"
import { getTranslationStatisticsQueryOptions } from "@app/utils/reactQuery/queryOptions"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Card } from "@app/components/ui/card"
import { BarChart3, BookOpen } from "lucide-react"

export function Statistics() {
	const t = useTranslations()

	const {
		data: { data },
	} = useSuspenseQuery(getTranslationStatisticsQueryOptions())

	if (!data || data.total_translations === 0) {
		return (
			<section className="mb-8">
				<Card className="p-4 gap-0">
					<div className="flex items-center gap-2 mb-2">
						<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
							<BarChart3 className="h-4 w-4 text-primary" />
						</div>
						<h2 className="text-sm font-semibold">{t("pages.home.statistics.title")}</h2>
					</div>
					<p className="text-sm text-muted-foreground">{t("pages.home.statistics.empty")}</p>
				</Card>
			</section>
		)
	}

	return (
		<section className="mb-8">
			<Card className="p-4 gap-0">
				<div className="flex items-center gap-2 mb-2">
					<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
						<BarChart3 className="h-4 w-4 text-primary" />
					</div>
					<h2 className="text-sm font-semibold">{t("pages.home.statistics.title")}</h2>
				</div>

				<div className="flex items-center justify-between pb-2 mb-2 border-b border-border/50">
					<div className="flex items-center gap-2">
						<BookOpen className="h-4 w-4 text-muted-foreground" />
						<span className="text-sm text-muted-foreground">{t("pages.home.statistics.totalTranslations")}</span>
					</div>
					<span className="text-base font-semibold tabular-nums">{data.total_translations}</span>
				</div>

				{data.words_per_pos_tag && data.words_per_pos_tag.length > 0 && (
					<div>
						<span className="text-sm text-muted-foreground">{t("pages.home.statistics.wordsByPosTag")}</span>
						<ul className="mt-2 space-y-1.5">
							{data.words_per_pos_tag.map((item) => {
								if (item.count < 1) return null

								return (
									<li key={item.universal_pos_tag_id} className="flex items-center justify-between">
										<span className="text-sm">{t(`common.posTags.${item.code}`)}</span>
										<span className="text-sm tabular-nums text-muted-foreground">{item.count}</span>
									</li>
								)
							})}
						</ul>
					</div>
				)}
			</Card>
		</section>
	)
}
