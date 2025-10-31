import { CollectionEditFormState } from "@app/components/appSidebar/components/sidebarCollections/components/sidebarCollectionEditForm/utils/collectionEditFormTypes"
import { getCollectionEditFormSchema } from "@app/components/appSidebar/components/sidebarCollections/components/sidebarCollectionEditForm/utils/collectionEditFromSchema"
import { Button } from "@app/components/ui/button"
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

type ISidebarCollectionEditFormProps = {
	id: number
	defaultValues: CollectionEditFormState
	onSubmit: () => void
	onCancel: () => void
}

export const SidebarCollectionEditForm = ({
	id,
	defaultValues,
	onCancel,
	onSubmit,
}: ISidebarCollectionEditFormProps) => {
	// --- STATE ---

	const { toast } = useToast()

	const t = useTranslations()

	const queryClient = useQueryClient()

	const form = useForm<CollectionEditFormState>({
		defaultValues,
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

			onSubmit()
		},
		onError: () => {
			toast({
				title: t("components.navCollections.editForm.toast.error.title"),
				description: t("components.navCollections.editForm.toast.error.description"),
			})
		},
	})

	const isFormStateValid = form.formState.isValid

	// --- CALLBACKS ---

	const handleSubmit = useCallback(
		async (value: CollectionEditFormState) => {
			await mutateCollectionEdit({
				params: { path: { id } },
				body: { name: value.name },
			})
		},
		[id, mutateCollectionEdit],
	)

	const handleCancel = useCallback(() => {
		onCancel()

		form.reset()
	}, [form, onCancel])

	const handleKeyDownSubmit = useCallback(
		async (event: KeyboardEvent) => {
			event.stopPropagation()

			if (event.key === "Enter" && !isFormStateValid) {
				console.log("1")

				await form.trigger()
			}

			if (event.key === "Enter" && isFormStateValid) {
				console.log("2")

				await handleSubmit(form.getValues())
			}
		},
		[form, isFormStateValid, handleSubmit],
	)

	// --- RENDER ---

	return (
		<FormProvider {...form}>
			<Form onKeyDown={handleKeyDownSubmit} onSubmit={form.handleSubmit(handleSubmit)}>
				<FormField
					control={form.control}
					label={t("components.navCollections.editForm.label")}
					name="name"
					render={(fieldProps) => (
						<Input
							placeholder={t("components.navCollections.editForm.placeholder")}
							type="text"
							{...fieldProps.field}
						/>
					)}
				/>

				<div className="flex justify-end mt-4 gap-4">
					<Button type="button" variant="destructive" onClick={handleCancel}>
						{t("components.navCollection")}
					</Button>

					<Button type="submit" disabled={!isFormStateValid}>
						{t("components.navCollections.editForm.button")}
					</Button>
				</div>
			</Form>
		</FormProvider>
	)
}
