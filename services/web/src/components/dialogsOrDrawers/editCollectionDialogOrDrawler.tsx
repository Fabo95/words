import { useTranslations } from "next-intl"
import { useCallback } from "react"
import * as React from "react"
import { CollectionEditForm } from "@app/components/forms/collectionEditForm/collectionEditForm"
import {
	DialogOrDrawer,
	DialogOrDrawerContent,
	DialogOrDrawerDescription,
	DialogOrDrawerHeader,
	DialogOrDrawerTitle,
} from "@app/components/ui/dialogOrDrawer"

type EditCollectionDialogOrDrawlerProps = {
	id: number
	name: string
	isDialogOpen: boolean
	setIsDialogOpen: (isOpen: boolean) => void
}

export const EditCollectionDialogOrDrawler = ({
	id,
	name,
	isDialogOpen,
	setIsDialogOpen,
}: EditCollectionDialogOrDrawlerProps) => {
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
					<DialogOrDrawerTitle>{t("components.navCollections.editForm.title")}</DialogOrDrawerTitle>

					<DialogOrDrawerDescription>{t("components.navCollections.editForm.description")}</DialogOrDrawerDescription>
				</DialogOrDrawerHeader>

				<CollectionEditForm id={id} defaultValues={{ name }} onSubmit={closeDialog} onCancel={closeDialog} />
			</DialogOrDrawerContent>
		</DialogOrDrawer>
	)
}
