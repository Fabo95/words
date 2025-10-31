import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "services/words/src/components/ui/dialog"
import { useTranslations } from "next-intl"
import { useCallback } from "react"
import * as React from "react"
import { SidebarCollectionCreateForm } from "services/words/src/components/appSidebar/components/sidebarCollections/components/sidebarCollectionCreateForm/sidebarCollectionCreateForm"

type ISidebarCollectionCreateDialogProps = {
	isDialogOpen: boolean
	setIsDialogOpen: (isOpen: boolean) => void
}

export const SidebarCollectionCreateDialog = ({
	isDialogOpen,
	setIsDialogOpen,
}: ISidebarCollectionCreateDialogProps) => {
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
					<DialogTitle>{t("components.navCollections.createForm.title")}</DialogTitle>

					<DialogDescription>{t("components.navCollections.createForm.description")}</DialogDescription>
				</DialogHeader>

				<SidebarCollectionCreateForm onSubmit={closeDialog} onCancel={closeDialog} />
			</DialogContent>
		</Dialog>
	)
}
