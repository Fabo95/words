import { useTranslations } from "next-intl"
import { useCallback } from "react"
import * as React from "react"
import { CollectionCreateForm } from "@app/components/forms/collectionCreateForm/collectionCreateForm"
import {
	DialogOrDrawer,
	DialogOrDrawerContent,
	DialogOrDrawerDescription,
	DialogOrDrawerHeader,
	DialogOrDrawerTitle,
} from "@app/components/ui/dialogOrDrawer"

type CreateCollectionDialogOrDrawlerProps = {
	isDialogOpen: boolean
	setIsDialogOpen: (isOpen: boolean) => void
}

export const CreateCollectionDialogOrDrawler = ({
	isDialogOpen,
	setIsDialogOpen,
}: CreateCollectionDialogOrDrawlerProps) => {
	// --- STATE ---

	const t = useTranslations()

	// --- CALLBACKS ---

	const closeDialog = useCallback(() => {
		setIsDialogOpen(false)
	}, [setIsDialogOpen])

	// --- RENDER ---

	return (
		<DialogOrDrawer open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogOrDrawerContent>
				<DialogOrDrawerHeader>
					<DialogOrDrawerTitle>{t("components.navCollections.createForm.title")}</DialogOrDrawerTitle>

					<DialogOrDrawerDescription>{t("components.navCollections.createForm.description")}</DialogOrDrawerDescription>
				</DialogOrDrawerHeader>

				<CollectionCreateForm onSubmit={closeDialog} onCancel={closeDialog} />
			</DialogOrDrawerContent>
		</DialogOrDrawer>
	)
}
