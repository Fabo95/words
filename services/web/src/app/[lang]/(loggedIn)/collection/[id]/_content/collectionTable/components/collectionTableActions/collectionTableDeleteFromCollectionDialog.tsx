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
import { useTranslations } from "next-intl"
import { useQueryClient } from "@tanstack/react-query"

type CollectionTableDeleteFromCollectionDialogProps = {
	id: number
	translationId: number
	handleIsDialogOpen: (isOpen: boolean) => void
}

export const CollectionTableDeleteFromCollectionDialog = ({
	translationId,
	handleIsDialogOpen,
}: CollectionTableDeleteFromCollectionDialogProps) => {
	// --- STATE ---

	const { toast } = useToast()

	const t = useTranslations()

	const queryClient = useQueryClient()

	const { mutateAsync: mutateTranslationDelete } = $api.useMutation("delete", "/translation/{id}", {
		onSuccess: (data) => {
			console.log({ data })

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
