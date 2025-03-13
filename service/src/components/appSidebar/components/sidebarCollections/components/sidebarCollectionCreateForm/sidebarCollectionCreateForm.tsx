import { CollectionFormState } from "@app/components/appSidebar/components/sidebarCollections/components/sidebarCollectionCreateForm/utils/collectionFormTypes"
import { getCollectionFormSchema } from "@app/components/appSidebar/components/sidebarCollections/components/sidebarCollectionCreateForm/utils/collectionFromSchema"
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

type SidebarCollectionCreateFormProps = { handleIsDialogOpen: (isOpen: boolean) => void }

export const SidebarCollectionCreateForm = ({ handleIsDialogOpen }: SidebarCollectionCreateFormProps) => {
	// --- STATE ---

	const { toast } = useToast()

	const t = useClientTFunction()

	const queryClient = useQueryClient()

	const form = useForm<CollectionFormState>({
		defaultValues: {
			name: "",
		},
		mode: "onBlur",
		resolver: zodResolver(getCollectionFormSchema(t)),
	})

	const { mutateAsync: mutateCollectionCreate } = $api.useMutation("post", "/collection", {
		onSuccess: (data) => {
			console.log({ data })
			queryClient.setQueryData(["get", "/collection/all"], (oldData) =>
				oldData
					? {
							...oldData,
							response_object: [...oldData.response_object, data.response_object],
						}
					: oldData,
			)

			toast({
				title: t("components.navCollections.form.toast.success.title"),
				description: t("components.navCollections.form.toast.success.description"),
			})

			handleIsDialogOpen(false)
		},
		onError: () => {
			toast({
				title: t("components.navCollections.form.toast.error.title"),
				description: t("components.navCollections.form.toast.error.description"),
			})
		},
	})

	// --- CALLBACKS ---

	const onSubmit = useCallback(
		async (value: CollectionFormState) => {
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
					<DialogHeader className="mb-5">
						<DialogTitle>{t("components.navCollections.form.title")}</DialogTitle>

						<DialogDescription className="mb-5">{t("components.navCollections.form.description")} </DialogDescription>

						<FormField
							control={form.control}
							input={Input}
							label={t("components.navCollections.form.label")}
							name="name"
							placeholder={t("components.navCollections.form.placeholder")}
						/>
					</DialogHeader>

					<DialogFooter>
						<Button disabled={!form.formState.isValid}>{t("components.navCollections.form.button")}</Button>
					</DialogFooter>
				</Form>
			</FormProvider>
		</DialogContent>
	)
}
