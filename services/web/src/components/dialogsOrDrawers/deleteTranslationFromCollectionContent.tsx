import { SyntheticEvent, useCallback } from "react"

import { Button } from "@app/components/ui/button"
import { useToast } from "@app/components/ui/use-toast"
import { $api } from "@app/utils/api/apiRequests"
import { useTranslations } from "next-intl"
import { useQueryClient } from "@tanstack/react-query"
import {
	DialogOrDrawerContent,
	DialogOrDrawerDescription,
	DialogOrDrawerFooter,
	DialogOrDrawerHeader,
	DialogOrDrawerTitle,
} from "@app/components/ui/dialogOrDrawer"

type DeleteTranslationFromCollectionDialogContentProps = {
	id: number
	translationId: number
	handleIsDialogOpen: (isOpen: boolean) => void
}

export const DeleteTranslationFromCollectionContent = ({
	id,
	translationId,
	handleIsDialogOpen,
}: DeleteTranslationFromCollectionDialogContentProps) => {
	// --- STATE ---

	const { toast } = useToast()

	const t = useTranslations()

	const queryClient = useQueryClient()

	const { mutateAsync: removeFromCollection } = $api.useMutation(
		"delete",
		"/collection/{id}/translations/{translation_id}/wip3",
		{
			onSuccess: async () => {
				await Promise.all([
					queryClient.invalidateQueries({ queryKey: ["get", "/translation"] }),
					queryClient.invalidateQueries({ queryKey: ["get", "/collection/{id}/translations"] }),
				])

				toast({
					title: t("dialogs.removeTranslationFromCollectionDialog.toast.success.title"),
					description: t("dialogs.removeTranslationFromCollectionDialog.toast.success.description"),
				})
			},
			onError: () => {
				toast({
					title: t("dialogs.removeTranslationFromCollectionDialog.toast.error.title"),
					description: t("dialogs.removeTranslationFromCollectionDialog.toast.error.description"),
				})
			},
		},
	)

	// --- CALLBACKS ---

	const handleRemoveFromCollection = useCallback(async () => {
		await removeFromCollection({ params: { path: { id, translation_id: translationId } } })

		handleIsDialogOpen(false)
	}, [id, translationId, removeFromCollection, handleIsDialogOpen])

	// --- RENDER ---

	return (
		<DialogOrDrawerContent onClick={(e: SyntheticEvent) => e.stopPropagation()}>
			<DialogOrDrawerHeader>
				<DialogOrDrawerTitle>{t("dialogs.removeTranslationFromCollectionDialog.title")}</DialogOrDrawerTitle>

				<DialogOrDrawerDescription>
					{t("dialogs.removeTranslationFromCollectionDialog.description")}
				</DialogOrDrawerDescription>
			</DialogOrDrawerHeader>

			<DialogOrDrawerFooter>
				<Button variant="secondary" onClick={() => handleIsDialogOpen(false)}>
					{t("dialogs.removeTranslationFromCollectionDialog.cancelButton")}
				</Button>

				<Button onClick={handleRemoveFromCollection}>
					{t("dialogs.removeTranslationFromCollectionDialog.removeButton")}
				</Button>
			</DialogOrDrawerFooter>
		</DialogOrDrawerContent>
	)
}
