import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@app/components/ui/dialog"
import { Separator } from "@app/components/ui/separator"
import { ScrollArea } from "@app/components/ui/scroll-area"
import * as React from "react"
import { TranslationDetails } from "@app/utils/entities/translationDetails"
import { useTranslations } from "next-intl"

type TranslationDetailsDialogProps = {
	isOpen: boolean
	onOpenChange: (isOpen: boolean) => void
	translationDetails: TranslationDetails
}

export const TranslationDetailsDialog = ({
	isOpen,
	onOpenChange,
	translationDetails,
}: TranslationDetailsDialogProps) => {
	const t = useTranslations()

	return (
		<Dialog open={Boolean(translationDetails)} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-lg p-0 overflow-hidden">
				<DialogHeader className="px-6 py-4">
					<DialogTitle className="text-xl">{t("pages.collection.table.dialog.title")}</DialogTitle>
					<DialogDescription>{t("pages.collection.table.dialog.description")}</DialogDescription>
				</DialogHeader>

				<Separator />

				<ScrollArea className="max-h-[70vh]">
					<div className="px-6 py-5 space-y-6">
						{/* word + translation header */}
						<div className="flex items-start justify-between gap-4">
							<div className="space-y-1">
								<div className="flex items-center gap-2">
									<h4 className="text-sm font-medium text-muted-foreground mb-1">
										{t("pages.collection.table.dialog.word")}
									</h4>
								</div>
								<p className="text-base">{translationDetails?.sourceText ?? "—"}</p>
							</div>

							<div className="text-right space-y-1">
								<h4 className="text-sm font-medium text-muted-foreground mb-1">
									{t("pages.collection.table.dialog.translation")}
								</h4>

								<p className="text-base">{translationDetails?.targetText ?? "—"}</p>
							</div>
						</div>

						<Separator />

						{/* CEFR + POS */}
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							<div className="sm:col-span-1">
								<h4 className="text-sm font-medium text-muted-foreground mb-1">
									{t("pages.collection.table.dialog.cefrLevel")}
								</h4>
								<p className="text-base">{translationDetails?.cefrLevel?.code ?? "—"}</p>
							</div>

							<div className="sm:col-span-2">
								<h4 className="text-sm font-medium text-muted-foreground mb-2">
									{t("pages.collection.table.dialog.universalPosTags")}
								</h4>

								{translationDetails?.universalPosTags.length ? (
									<div className="flex flex-wrap gap-2">
										{(translationDetails?.universalPosTags ?? []).map((tag) => (
											<p className="text-base" key={tag.id}>
												{tag.name},
											</p>
										))}
									</div>
								) : (
									<p className="text-base">—</p>
								)}
							</div>
						</div>

						<Separator />

						{/* Example sentences */}
						<div>
							<h4 className="text-sm font-medium text-muted-foreground mb-2">
								{t("pages.collection.table.dialog.exampleSentences")}
							</h4>
							{translationDetails?.exampleSentences.length ? (
								<ul className="space-y-3">
									{(translationDetails?.exampleSentences ?? []).map((ex) => (
										<li key={ex.id ?? ex.sentence} className="rounded-lg border p-3 text-sm leading-relaxed">
											<p className="text-sm">{ex.sentence}</p>
										</li>
									))}
								</ul>
							) : (
								<p className="text-base">—</p>
							)}
						</div>
					</div>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	)
}
