"use client"

import { useTranslations } from "next-intl"
import { PartyPopper } from "lucide-react"

export function LearningEmptyState() {
	const t = useTranslations()

	return (
		<div className="mx-auto w-full max-w-lg">
			<div className="text-center py-12">
				<div className="flex justify-center mb-6">
					<div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
						<PartyPopper className="h-6 w-6 text-primary" />
					</div>
				</div>
				<h1 className="text-lg md:text-xl font-semibold">{t("pages.learning.empty.title")}</h1>
				<p className="text-sm text-muted-foreground">{t("pages.learning.empty.description")}</p>
				<p className="text-sm text-muted-foreground">{t("pages.learning.empty.hint")}</p>
			</div>
		</div>
	)
}
