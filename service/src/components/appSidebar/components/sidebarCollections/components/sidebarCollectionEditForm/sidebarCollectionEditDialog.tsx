import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@app/components/ui/dialog"
import { useTranslations } from "next-intl"
import { useCallback } from "react"
import * as React from "react"
import { SidebarCollectionEditForm } from "@app/components/appSidebar/components/sidebarCollections/components/sidebarCollectionEditForm/sidebarCollectionEditForm"

type SidebarCollectionEditFormProps = {
	id: number
	name: string
	isDialogOpen: boolean
	setIsDialogOpen: (isOpen: boolean) => void
}

export const SidebarCollectionEditDialog = ({
	id,
	name,
	isDialogOpen,
	setIsDialogOpen,
}: SidebarCollectionEditFormProps) => {
	// --- STATE ---

	const t = useTranslations()

	// --- CALLBACKS ---

	const closeDialog = useCallback(() => {
		setIsDialogOpen(false)
	}, [setIsDialogOpen])

	// --- RENDER ---

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("components.navCollections.editForm.title")}</DialogTitle>

					<DialogDescription>{t("components.navCollections.editForm.description")}</DialogDescription>
				</DialogHeader>

				<DialogDescription>
					<SidebarCollectionEditForm id={id} defaultValues={{ name }} onSubmit={closeDialog} onCancel={closeDialog} />
				</DialogDescription>
			</DialogContent>
		</Dialog>
	)
}
