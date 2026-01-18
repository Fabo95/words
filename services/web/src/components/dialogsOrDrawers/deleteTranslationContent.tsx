import { useCallback } from "react"

import { Button } from "@app/components/ui/button"
import { useToast } from "@app/components/ui/use-toast"
import { $api } from "@app/utils/api/apiRequests"
import { useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import {
	DialogOrDrawerContent,
	DialogOrDrawerDescription,
	DialogOrDrawerFooter,
	DialogOrDrawerHeader,
	DialogOrDrawerTitle,
} from "@app/components/ui/dialogOrDrawer"
import { getLatestTranslationsQueryOptions } from "@app/utils/reactQuery/queryOptions"

type DeleteTranslationDialogContentProps = {
	translationId: number
	handleIsDialogOpen: (isOpen: boolean) => void
}

export const DeleteTranslationContent = ({
	translationId,
	handleIsDialogOpen,
}: DeleteTranslationDialogContentProps) => {
	// --- STATE ---

	const { toast } = useToast()

	const t = useTranslations()

	const queryClient = useQueryClient()

	const { mutateAsync: mutateTranslationDelete } = $api.useMutation("delete", "/translation/{id}", {
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: ["get", "/collection/{id}/translations"],
				}),
				queryClient.invalidateQueries({ queryKey: getLatestTranslationsQueryOptions().queryKey }),
			])

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

		await Promise.all([
			queryClient.invalidateQueries({
				queryKey: ["get", "/collection/{id}/translations"],
			}),
			queryClient.invalidateQueries({ queryKey: getLatestTranslationsQueryOptions().queryKey }),
		])

		handleIsDialogOpen(false)
	}, [translationId, mutateTranslationDelete, handleIsDialogOpen, queryClient.invalidateQueries])

	// --- RENDER ---

	return (
		<DialogOrDrawerContent onClick={(e) => e.stopPropagation()}>
			<DialogOrDrawerHeader>
				<DialogOrDrawerTitle>{t("dialogs.deleteTranslationDialog.title")}</DialogOrDrawerTitle>

				<DialogOrDrawerDescription>{t("dialogs.deleteTranslationDialog.description")}</DialogOrDrawerDescription>
			</DialogOrDrawerHeader>

			<DialogOrDrawerFooter>
				<Button variant="secondary" onClick={() => handleIsDialogOpen(false)}>
					{t("dialogs.deleteTranslationDialog.cancelButton")}
				</Button>

				<Button onClick={handleDeleteCollection}>{t("dialogs.deleteTranslationDialog.deleteButton")}</Button>
			</DialogOrDrawerFooter>
		</DialogOrDrawerContent>
	)
}
