import { useCallback } from "react"

import { Button } from "@app/components/ui/button"
import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@app/components/ui/dialog"
import { useToast } from "@app/components/ui/use-toast"
import { $api } from "@app/utils/api/apiRequests"
import { useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"

type CollectionTableDeleteTranslationDialogProps = {
	id: number
	translationId: number
	handleIsDialogOpen: (isOpen: boolean) => void
}

export const CollectionTableDeleteTranslationDialog = ({
	id,
	translationId,
	handleIsDialogOpen,
}: CollectionTableDeleteTranslationDialogProps) => {
	// --- STATE ---

	const { toast } = useToast()

	const t = useTranslations()

	const queryClient = useQueryClient()

	const { mutateAsync: mutateTranslationDelete } = $api.useMutation("delete", "/translation/{id}", {
		onSuccess: () => {
			console.log("queryCache", queryClient.getQueryCache())

			queryClient.setQueryData(["get", "/collection/{id}/translations", { params: { path: { id } } }], (oldData) => {
				console.log("oldData", oldData)
				return oldData
					? {
							...oldData,
							response_object: oldData.response_object.filter((translation) => translation.id !== translationId),
						}
					: oldData
			})

			toast({
				title: t("pages.collection.table.deleteTranslationDialog.toast.success.title"),
				description: t("pages.collection.table.deleteTranslationDialog.toast.success.description"),
			})
		},
		onError: () => {
			toast({
				title: t("pages.collection.table.deleteTranslationDialog.toast.error.title"),
				description: t("pages.collection.table.deleteTranslationDialog.toast.success.description"),
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
		<DialogContent>
			<DialogHeader>
				<DialogTitle>{t("pages.collection.table.deleteTranslationDialog.title")}</DialogTitle>

				<DialogDescription>{t("pages.collection.table.deleteTranslationDialog.description")}</DialogDescription>
			</DialogHeader>

			<DialogFooter>
				<Button variant="secondary" onClick={() => handleIsDialogOpen(false)}>
					{t("pages.collection.table.deleteTranslationDialog.cancelButton")}
				</Button>

				<Button onClick={handleDeleteCollection}>
					{t("pages.collection.table.deleteTranslationDialog.deleteButton")}
				</Button>
			</DialogFooter>
		</DialogContent>
	)
}
