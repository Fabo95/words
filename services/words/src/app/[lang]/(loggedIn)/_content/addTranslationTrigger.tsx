"use client"

import { useState } from "react"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "services/words/src/components/ui/dialog"
import { TranslationForm } from "services/words/src/app/[lang]/(loggedIn)/home/_content/TranslationForm"
import * as React from "react"
import { useTranslations } from "next-intl"
import { Button } from "services/words/src/components/ui/button"
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
						<DialogTitle>{t("pages.home.createTranslationForm.title")}</DialogTitle>

						<DialogDescription>{t("pages.home.createTranslationForm.description")}</DialogDescription>
					</DialogHeader>

					{isTranslationFormOpen && <TranslationForm />}
				</DialogContent>
			</Dialog>
		</>
	)
}
