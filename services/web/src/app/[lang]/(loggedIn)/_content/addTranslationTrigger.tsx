"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@app/components/ui/dialog"
import * as React from "react"
import { useTranslations } from "next-intl"
import { Button } from "@app/components/ui/button"
import { PlusIcon } from "@radix-ui/react-icons"
import { TranslationForm } from "@app/components/forms/translationForm/translationForm"
import { $api } from "@app/utils/api/apiRequests"
import { TranslationFormState } from "@app/components/forms/translationForm/utils/translationFormTypes"

type AddTranslationTriggerProps = {
	defaultValues?: Partial<TranslationFormState>
	title?: string
	className?: string
	size: "sm" | "icon"
	variant: "ghost" | "outline"
}

export const AddTranslationTrigger = ({
	defaultValues,
	title,
	className,
	size,
	variant,
}: AddTranslationTriggerProps) => {
	const t = useTranslations()

	const [isTranslationFormOpen, setIsTranslationFormOpen] = useState(false)

	const {
		data: { data: collections },
	} = $api.useSuspenseQuery("get", "/collection/wip1")

	const {
		data: { data: cefrLevels },
	} = $api.useSuspenseQuery("get", "/cefr-levels")

	return (
		<>
			<Button
				className={className}
				data-sidebar="trigger"
				variant={variant}
				size={size}
				onClick={() => setIsTranslationFormOpen(true)}
			>
				<PlusIcon />

				{title && <span>{title}</span>}
			</Button>

			<Dialog open={isTranslationFormOpen} onOpenChange={setIsTranslationFormOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t("forms.translationForm.title")}</DialogTitle>

						<DialogDescription>{t("forms.translationForm.description")}</DialogDescription>
					</DialogHeader>

					{isTranslationFormOpen && (
						<TranslationForm
							cefrLevels={cefrLevels}
							collections={collections}
							onSubmit={() => setIsTranslationFormOpen(false)}
							onCancel={() => setIsTranslationFormOpen(false)}
							formType="create"
							defaultValues={defaultValues ?? {}}
						/>
					)}
				</DialogContent>
			</Dialog>
		</>
	)
}
