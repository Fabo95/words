import { CollectionCreateFormState } from "@app/components/appSidebar/components/sidebarCollections/components/sidebarCollectionCreateForm/utils/collectionCreateFormTypes"
import { getCollectionCreateFormSchema } from "@app/components/appSidebar/components/sidebarCollections/components/sidebarCollectionCreateForm/utils/collectionCreateFromSchema"
import { Button } from "@app/components/ui/button"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@app/components/ui/dialog"
import { Form, FormProvider } from "@app/components/ui/form"
import { FormField } from "@app/components/ui/formField"
import { Input } from "@app/components/ui/input"
import { useToast } from "@app/components/ui/use-toast"
import { $api } from "@app/utils/api/apiRequests"
import { useTranslations } from "next-intl"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"
import { useForm } from "react-hook-form"
import * as React from "react"

type ISidebarCollectionCreateFormProps = { handleIsDialogOpen: (isOpen: boolean) => void }

export const SidebarCollectionCreateForm = ({ handleIsDialogOpen }: ISidebarCollectionCreateFormProps) => {
	// --- STATE ---

	const { toast } = useToast()

	const t = useTranslations()

	const queryClient = useQueryClient()

	const form = useForm<CollectionCreateFormState>({
		defaultValues: {
			name: "",
		},
		mode: "onBlur",
		resolver: zodResolver(getCollectionCreateFormSchema(t)),
	})

	const { mutateAsync: mutateCollectionCreate } = $api.useMutation("post", "/collection", {
		onSuccess: (data) => {
			console.log({ data })
			queryClient.setQueryData(["get", "/user/collections"], (oldData) =>
				oldData
					? {
							...oldData,
							response_object: [...oldData.response_object, data.response_object],
						}
					: oldData,
			)

			toast({
				title: t("components.navCollections.createForm.toast.success.title"),
				description: t("components.navCollections.createForm.toast.success.description"),
			})

			form.reset()

			handleIsDialogOpen(false)
		},
		onError: () => {
			toast({
				title: t("components.navCollections.createForm.toast.error.title"),
				description: t("components.navCollections.createForm.toast.error.description"),
			})
		},
	})

	// --- CALLBACKS ---

	const onSubmit = useCallback(
		async (value: CollectionCreateFormState) => {
			await mutateCollectionCreate({
				body: { name: value.name },
			})
		},
		[mutateCollectionCreate],
	)

	// --- RENDER ---

	return (
		<DialogContent>
			<FormProvider {...form}>
				<Form onSubmit={form.handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>{t("components.navCollections.createForm.title")}</DialogTitle>

						<DialogDescription>{t("components.navCollections.createForm.description")}</DialogDescription>

						<FormField
							control={form.control}
							label={t("components.navCollections.createForm.label")}
							name="name"
							render={(fieldProps) => (
								<Input
									placeholder={t("components.navCollections.createForm.placeholder")}
									type="text"
									{...fieldProps.field}
								/>
							)}
						/>
					</DialogHeader>

					<DialogFooter>
						<Button disabled={!form.formState.isValid}>{t("components.navCollections.createForm.button")}</Button>
					</DialogFooter>
				</Form>
			</FormProvider>
		</DialogContent>
	)
}
