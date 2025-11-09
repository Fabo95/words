import { useCallback } from "react"

import { Button } from "@app/components/ui/button"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@app/components/ui/dialog"
import { useToast } from "@app/components/ui/use-toast"
import { $api } from "@app/utils/api/apiRequests"
import { useTranslations } from "next-intl"
import { useQueryClient } from "@tanstack/react-query"

type DeleteTranslationFromCollectionDialogContentProps = {
	id: number
	translationId: number
	handleIsDialogOpen: (isOpen: boolean) => void
}

export const DeleteTranslationFromCollectionDialogContent = ({
	translationId,
	handleIsDialogOpen,
}: DeleteTranslationFromCollectionDialogContentProps) => {
	// --- STATE ---

	const { toast } = useToast()

	const t = useTranslations()

	const queryClient = useQueryClient()

	const { mutateAsync: mutateTranslationDelete } = $api.useMutation("delete", "/translation/{id}", {
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["get", "/collection/{id}/translations"] })

			toast({
				title: t("dialogs.deleteTranslationDialog.toast.success.title"),
				description: t("dialogs.deleteTranslationDialog.toast.success.description"),
			})
		},
		onError: () => {
			toast({
				title: t("dialogs.deleteTranslationDialog.toast.error.title"),
				description: t("dialogs.deleteTranslationDialog.toast.success.description"),
			})
		},
	})

	// --- CALLBACKS ---

	const handleDeleteCollection = useCallback(async () => {
		await mutateTranslationDelete({ params: { path: { id: translationId } } })

		handleIsDialogOpen(false)
	}, [translationId, mutateTranslationDelete, handleIsDialogOpen])

	// --- RENDER ---

	return (
		<DialogContent onClick={(e) => e.stopPropagation()}>
			<DialogHeader>
				<DialogTitle>{t("dialogs.deleteTranslationDialog.title")}</DialogTitle>

				<DialogDescription>{t("dialogs.deleteTranslationDialog.description")}</DialogDescription>
			</DialogHeader>

			<DialogFooter>
				<Button variant="secondary" onClick={() => handleIsDialogOpen(false)}>
					{t("dialogs.deleteTranslationDialog.cancelButton")}
				</Button>

				<Button onClick={handleDeleteCollection}>{t("dialogs.deleteTranslationDialog.deleteButton")}</Button>
			</DialogFooter>
		</DialogContent>
	)
}
