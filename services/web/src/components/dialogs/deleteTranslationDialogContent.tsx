import { useCallback } from "react"

import { Button } from "@app/components/ui/button"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@app/components/ui/dialog"
import { useToast } from "@app/components/ui/use-toast"
import { $api } from "@app/utils/api/apiRequests"
import { useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"

type DeleteTranslationDialogContentProps = {
	id: number
	translationId: number
	handleIsDialogOpen: (isOpen: boolean) => void
}

export const DeleteTranslationDialogContent = ({
	id,
	translationId,
	handleIsDialogOpen,
}: DeleteTranslationDialogContentProps) => {
	// --- STATE ---

	const { toast } = useToast()

	const t = useTranslations()

	const queryClient = useQueryClient()

	const { mutateAsync: mutateTranslationDelete } = $api.useMutation("delete", "/translation/{id}", {
		onSuccess: () => {
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

		await queryClient.invalidateQueries({ queryKey: ["get", "/collection/{id}/translations"] })

		handleIsDialogOpen(false)
	}, [translationId, mutateTranslationDelete, handleIsDialogOpen, queryClient.invalidateQueries])

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
