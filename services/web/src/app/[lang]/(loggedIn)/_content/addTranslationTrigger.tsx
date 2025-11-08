"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@app/components/ui/dialog"
import { CreateTranslationForm } from "@app/components/forms/createTranslationForm/createTranslationForm"
import * as React from "react"
import { useTranslations } from "next-intl"
import { Button } from "@app/components/ui/button"
import { PlusIcon } from "@radix-ui/react-icons"

export const AddTranslationTrigger = () => {
	const t = useTranslations()

	const [isTranslationFormOpen, setIsTranslationFormOpen] = useState(false)

	return (
		<>
			<Button
				data-sidebar="trigger"
				variant="ghost"
				size="icon"
				className="h-7 w-7"
				onClick={() => setIsTranslationFormOpen(true)}
			>
				<PlusIcon />
				<span className="sr-only">Toggle Sidebar</span>
			</Button>

			<Dialog open={isTranslationFormOpen} onOpenChange={setIsTranslationFormOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t("forms.createTranslationForm.title")}</DialogTitle>

						<DialogDescription>{t("forms.createTranslationForm.description")}</DialogDescription>
					</DialogHeader>

					{isTranslationFormOpen && <CreateTranslationForm />}
				</DialogContent>
			</Dialog>
		</>
	)
}
