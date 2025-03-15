import { CollectionEditFormState } from "@app/components/appSidebar/components/sidebarCollections/components/sidebarCollectionEditForm/utils/collectionEditFormTypes"
import { getCollectionEditFormSchema } from "@app/components/appSidebar/components/sidebarCollections/components/sidebarCollectionEditForm/utils/collectionEditFromSchema"
import { Button } from "@app/components/ui/button"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@app/components/ui/dialog"
import { Form, FormProvider } from "@app/components/ui/form"
import { FormField } from "@app/components/ui/formField"
import { Input } from "@app/components/ui/input"
import { useToast } from "@app/components/ui/use-toast"
import { $api } from "@app/utils/api/apiRequests"
import { useClientTFunction } from "@app/utils/i18n/utils/i18nHooks"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"
import { useForm } from "react-hook-form"

type SidebarCollectionEditFormProps = { id: number; name: string; handleIsDialogOpen: (isOpen: boolean) => void }

export const SidebarCollectionEditForm = ({ id, name, handleIsDialogOpen }: SidebarCollectionEditFormProps) => {
	// --- STATE ---

	const { toast } = useToast()

	const t = useClientTFunction()

	const queryClient = useQueryClient()

	const form = useForm<CollectionEditFormState>({
		defaultValues: {
			name,
		},
		mode: "onBlur",
		resolver: zodResolver(getCollectionEditFormSchema(t)),
	})

	const { mutateAsync: mutateCollectionEdit } = $api.useMutation("patch", "/collection/{id}", {
		onSuccess: (data) => {
			console.log({ data })
			queryClient.setQueryData(["get", "/user/collections"], (oldData) =>
				oldData
					? {
							...oldData,
							response_object: oldData.response_object?.map((collection) => {
								if (collection.id === id) {
									return data.response_object
								}
								return collection
							}),
						}
					: oldData,
			)

			toast({
				title: t("components.navCollections.editForm.toast.success.title"),
				description: t("components.navCollections.editForm.toast.success.description"),
			})

			form.reset()

			handleIsDialogOpen(false)
		},
		onError: () => {
			toast({
				title: t("components.navCollections.editForm.toast.error.title"),
				description: t("components.navCollections.editForm.toast.error.description"),
			})
		},
	})

	// --- CALLBACKS ---

	const onSubmit = useCallback(
		async (value: CollectionEditFormState) => {
			await mutateCollectionEdit({
				params: { path: { id } },
				body: { name: value.name },
			})
		},
		[id, mutateCollectionEdit],
	)

	// --- RENDER ---

	return (
		<DialogContent>
			<FormProvider {...form}>
				<Form onSubmit={form.handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>{t("components.navCollections.editForm.title")}</DialogTitle>

						<DialogDescription>{t("components.navCollections.editForm.description")}</DialogDescription>

						<FormField
							control={form.control}
							input={Input}
							label={t("components.navCollections.editForm.label")}
							name="name"
							placeholder={t("components.navCollections.editForm.placeholder")}
						/>
					</DialogHeader>

					<DialogFooter>
						<Button disabled={!form.formState.isValid}>{t("components.navCollections.editForm.button")}</Button>
					</DialogFooter>
				</Form>
			</FormProvider>
		</DialogContent>
	)
}
