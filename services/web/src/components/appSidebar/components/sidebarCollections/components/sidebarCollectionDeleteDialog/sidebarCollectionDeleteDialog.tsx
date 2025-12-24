import { useCallback } from "react"

import { Button } from "@app/components/ui/button"
import {
	Dialog,
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

type ISidebarCollectionDeleteDialogProps = {
	isDialogOpen: boolean
	id: number
	setIsDialogOpen: (isOpen: boolean) => void
}

export const SidebarCollectionDeleteDialog = ({
	id,
	isDialogOpen,
	setIsDialogOpen,
}: ISidebarCollectionDeleteDialogProps) => {
	// --- STATE ---

	const { toast } = useToast()

	const t = useTranslations()

	const queryClient = useQueryClient()

	const { mutateAsync: mutateCollectionDelete } = $api.useMutation("delete", "/collection/{id}", {
		onSuccess: async (data) => {
			console.log({ data })

			await queryClient.invalidateQueries({ queryKey: ["/collection/wip1"] })

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

		setIsDialogOpen(false)
	}, [id, mutateCollectionDelete, setIsDialogOpen])

	// --- RENDER ---

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("components.navCollections.deleteDialog.title")}</DialogTitle>

					<DialogDescription>{t("components.navCollections.deleteDialog.description")}</DialogDescription>
				</DialogHeader>

				<DialogFooter>
					<Button onClick={() => setIsDialogOpen(false)}>
						{t("components.navCollections.deleteDialog.cancelButton")}
					</Button>

					<Button variant="destructive" onClick={handleDeleteCollection}>
						{t("components.navCollections.deleteDialog.deleteButton")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
