"use client"

import { useTranslations } from "next-intl"
import { PartyPopper } from "lucide-react"

export function LearningEmptyState() {
	const t = useTranslations()

	return (
		<div className="mx-auto w-full max-w-lg">
			<div className="text-center py-12">
				<div className="flex justify-center mb-6">
					<div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
						<PartyPopper className="h-10 w-10 text-primary" />
					</div>
				</div>
				<h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">
					{t("pages.learning.empty.title")}
				</h1>
				<p className="text-foreground/60 mb-2">{t("pages.learning.empty.description")}</p>
				<p className="text-sm text-foreground/40">{t("pages.learning.empty.hint")}</p>
			</div>
		</div>
	)
}
