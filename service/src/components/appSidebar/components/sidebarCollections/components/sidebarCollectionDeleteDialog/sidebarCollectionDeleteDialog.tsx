import { useCallback } from "react"

import { Button } from "@app/components/ui/button"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@app/components/ui/dialog"
import { useToast } from "@app/components/ui/use-toast"
import { $api } from "@app/utils/api/apiRequests"
import { useClientTFunction } from "@app/utils/i18n/utils/i18nHooks"
import { useQueryClient } from "@tanstack/react-query"

type SidebarCollectionDeleteDialogProps = { id: number; handleIsDialogOpen: (isOpen: boolean) => void }

export const SidebarCollectionDeleteDialog = ({ id, handleIsDialogOpen }: SidebarCollectionDeleteDialogProps) => {
	// --- STATE ---

	const { toast } = useToast()

	const t = useClientTFunction()

	const queryClient = useQueryClient()

	const { mutateAsync: mutateCollectionDelete } = $api.useMutation("delete", "/collection/{id}", {
		onSuccess: (data) => {
			console.log({ data })

			queryClient.setQueryData(["get", "/collection/all"], (oldData) =>
				oldData
					? {
							...oldData,
							response_object: oldData.response_object.filter((collection) => collection.id !== id),
						}
					: oldData,
			)

			toast({
				title: t("components.navCollections.deleteDialog.toast.success.title"),
				description: t("components.navCollections.deleteDialog.toast.success.description"),
			})
		},
		onError: () => {
			toast({
				title: t("components.navCollections.deleteDialog.toast.error.title"),
				description: t("components.navCollections.deleteDialog.toast.error.description"),
			})
		},
	})

	// --- CALLBACKS ---

	const handleDeleteCollection = useCallback(() => {
		mutateCollectionDelete({ params: { path: { id } } })

		handleIsDialogOpen(false)
	}, [id, mutateCollectionDelete, handleIsDialogOpen])

	// --- RENDER ---

	return (
		<DialogContent>
			<DialogHeader className="mb-5">
				<DialogTitle>{t("components.navCollections.deleteDialog.title")}</DialogTitle>

				<DialogDescription className="mb-5">
					{t("components.navCollections.deleteDialog.description")}
				</DialogDescription>
			</DialogHeader>

			<DialogFooter>
				<Button onClick={() => handleIsDialogOpen(false)}>
					{t("components.navCollections.deleteDialog.cancelButton")}
				</Button>

				<Button variant="destructive" onClick={handleDeleteCollection}>
					{t("components.navCollections.deleteDialog.deleteButton")}
				</Button>
			</DialogFooter>
		</DialogContent>
	)
}
