import { useTranslations } from "next-intl"
import * as React from "react"
import { cn } from "@app/utils/shadcn/shadcnHelpers"
import { CheckCircle2, Circle, Loader2, Tags, GraduationCap, MessageSquareText } from "lucide-react"
import { CefrLevel, ExampleSentence, Translation, UniversalPosTag } from "@app/utils/types/api"
import { Button } from "@app/components/ui/button"

export function isTranslationEnriched(translation: Translation) {
	const hasCefrLevel = isCefrLevelDone(translation?.cefrLevel)
	const hasUniversalPosTags = isUniversalPosTagsDone(translation?.universalPosTags)
	const hasExamples = isExamplesDone(translation?.exampleSentences)

	return hasCefrLevel && hasUniversalPosTags && hasExamples
}

type StepState = "done" | "active" | "todo"

function isCefrLevelDone(cefrLevel?: CefrLevel) {
	return Boolean(cefrLevel?.id)
}

function isUniversalPosTagsDone(universalPosTags?: UniversalPosTag[]) {
	return (universalPosTags?.length ?? 0) > 0
}

function isExamplesDone(exampleSentences?: ExampleSentence[]) {
	return (exampleSentences?.length ?? 0) > 0
}

type TranslationEnrichProps = { translation: Translation; onComplete: () => void }

export function TranslationEnrich({ translation, onComplete }: TranslationEnrichProps) {
	const t = useTranslations()

	const cefrDone = isCefrLevelDone(translation.cefrLevel)
	const posDone = isUniversalPosTagsDone(translation.universalPosTags)
	const exDone = isExamplesDone(translation.exampleSentences)

	// determine "active" step = first not done
	const activeIndex = !cefrDone ? 0 : !posDone ? 1 : !exDone ? 2 : -1

	const steps = [
		{
			key: "cefr",
			title: t("forms.translationForm.enriching.steps.cefr.title"),
			description: t("forms.translationForm.enriching.steps.cefr.description"),
			icon: GraduationCap,
			done: cefrDone,
		},
		{
			key: "pos",
			title: t("forms.translationForm.enriching.steps.pos.title"),
			description: t("forms.translationForm.enriching.steps.pos.description"),
			icon: Tags,
			done: posDone,
		},
		{
			key: "examples",
			title: t("forms.translationForm.enriching.steps.examples.title"),
			description: t("forms.translationForm.enriching.steps.examples.description"),
			icon: MessageSquareText,
			done: exDone,
		},
	]

	const allDone = cefrDone && posDone && exDone

	return (
		<div className="space-y-8">
			<div className="w-full max-w-md py-4">
				<div className="space-y-3">
					{steps.map((step, idx) => {
						const Icon = step.icon
						const state: StepState = step.done ? "done" : idx === activeIndex ? "active" : "todo"

						return (
							<div key={step.key} className="flex items-start gap-3">
								<div className="pt-0.5">
									{state === "done" ? (
										<CheckCircle2 className="h-5 w-5 text-foreground/70" />
									) : state === "active" ? (
										<div className="relative">
											<div className="absolute inset-0 rounded-full bg-foreground/10 blur-[6px]" />
											<Loader2 className="relative h-5 w-5 animate-spin text-foreground/60" />
										</div>
									) : (
										<Circle className="h-5 w-5 text-foreground/25" />
									)}
								</div>

								<div className="min-w-0 flex-1">
									<div className="flex items-center gap-2">
										<div
											className={cn(
												"flex h-7 w-7 items-center justify-center rounded-full border bg-background",
												state === "done" && "border-foreground/15",
												state === "active" && "border-foreground/25 shadow-sm",
												state === "todo" && "border-border/60",
											)}
										>
											<Icon
												className={cn(
													"h-4 w-4",
													state === "done" && "text-foreground/60",
													state === "active" && "text-foreground/70",
													state === "todo" && "text-foreground/30",
												)}
											/>
										</div>

										<p
											className={cn(
												"text-sm font-medium truncate",
												state === "done" && "text-foreground/70",
												state === "active" && "text-foreground/90",
												state === "todo" && "text-foreground/50",
											)}
										>
											{step.title}
										</p>

										{state === "active" ? (
											<span className="ml-auto text-[11px] text-foreground/40">
												{t("forms.translationForm.enriching.inProgress")}
											</span>
										) : state === "done" ? (
											<span className="ml-auto text-[11px] text-foreground/40">
												{t("forms.translationForm.enriching.done")}
											</span>
										) : null}
									</div>

									<p className={cn("mt-1 text-xs", state === "todo" ? "text-foreground/30" : "text-foreground/40")}>
										{step.description}
									</p>
								</div>
							</div>
						)
					})}
				</div>

				<Button className="mt-6 w-full" onClick={onComplete}>
					{t("forms.translationForm.enriching.completeButton")}
				</Button>
			</div>
		</div>
	)
}
