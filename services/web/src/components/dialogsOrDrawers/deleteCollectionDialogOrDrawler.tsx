import { useCallback } from "react"

import { Button } from "@app/components/ui/button"
import { useToast } from "@app/components/ui/use-toast"
import { $api } from "@app/utils/api/apiRequests"
import { useTranslations } from "next-intl"
import { useQueryClient } from "@tanstack/react-query"
import {
	DialogOrDrawer,
	DialogOrDrawerContent,
	DialogOrDrawerDescription,
	DialogOrDrawerFooter,
	DialogOrDrawerHeader,
	DialogOrDrawerTitle,
} from "@app/components/ui/dialogOrDrawer"
import { useIsMobile } from "@app/hooks/use-mobile"
import { getCollectionsQueryOptions, getLatestTranslationsQueryOptions } from "@app/utils/reactQuery/queryOptions"

type DeleteCollectionDialogOrDrawlerProps = {
	isDialogOpen: boolean
	id: number
	setIsDialogOpen: (isOpen: boolean) => void
}

export const DeleteCollectionDialogOrDrawler = ({
	id,
	isDialogOpen,
	setIsDialogOpen,
}: DeleteCollectionDialogOrDrawlerProps) => {
	// --- STATE ---

	const { toast } = useToast()

	const isMobile = useIsMobile()

	const t = useTranslations()

	const queryClient = useQueryClient()

	const { mutateAsync: mutateCollectionDelete } = $api.useMutation("delete", "/collection/{id}", {
		onSuccess: async (data) => {
			console.log({ data })

			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: ["get", "/collection/{id}/translations"],
				}),
				queryClient.invalidateQueries({ queryKey: getCollectionsQueryOptions().queryKey }),
				queryClient.invalidateQueries({ queryKey: getLatestTranslationsQueryOptions().queryKey }),
			])

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
		<DialogOrDrawer open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogOrDrawerContent>
				<DialogOrDrawerHeader>
					<DialogOrDrawerTitle>{t("components.navCollections.deleteDialog.title")}</DialogOrDrawerTitle>

					<DialogOrDrawerDescription>
						{t("components.navCollections.deleteDialog.description")}
					</DialogOrDrawerDescription>
				</DialogOrDrawerHeader>

				<DialogOrDrawerFooter>
					<div
						className={
							isMobile ? "mt-auto flex flex-col gap-2" : "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2"
						}
					>
						<Button onClick={() => setIsDialogOpen(false)}>
							{t("components.navCollections.deleteDialog.cancelButton")}
						</Button>
						<Button variant="destructive" onClick={handleDeleteCollection}>
							{t("components.navCollections.deleteDialog.deleteButton")}
						</Button>
					</div>
				</DialogOrDrawerFooter>
			</DialogOrDrawerContent>
		</DialogOrDrawer>
	)
}
