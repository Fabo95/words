"use client"

import { useState } from "react"
import * as React from "react"
import { useTranslations } from "next-intl"
import { Button } from "@app/components/ui/button"
import { PlusIcon } from "@radix-ui/react-icons"
import { TranslationForm } from "@app/components/forms/translationForm/translationForm"
import { TranslationFormState } from "@app/components/forms/translationForm/utils/translationFormTypes"
import {
	DialogOrDrawer,
	DialogOrDrawerContent,
	DialogOrDrawerDescription,
	DialogOrDrawerHeader,
	DialogOrDrawerTitle,
} from "@app/components/ui/dialogOrDrawer"
import { getCefrLevelsQueryOptions, getCollectionsQueryOptions } from "@app/utils/reactQuery/queryOptions"
import { useSuspenseQuery } from "@tanstack/react-query"

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
	} = useSuspenseQuery(getCollectionsQueryOptions())

	const {
		data: { data: cefrLevels },
	} = useSuspenseQuery(getCefrLevelsQueryOptions())

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

			<DialogOrDrawer open={isTranslationFormOpen} onOpenChange={setIsTranslationFormOpen}>
				<DialogOrDrawerContent>
					<DialogOrDrawerHeader>
						<DialogOrDrawerTitle>{t("forms.translationForm.title")}</DialogOrDrawerTitle>

						<DialogOrDrawerDescription>{t("forms.translationForm.description")}</DialogOrDrawerDescription>
					</DialogOrDrawerHeader>

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
				</DialogOrDrawerContent>
			</DialogOrDrawer>
		</>
	)
}
