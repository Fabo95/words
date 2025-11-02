import { CollectionCreateFormState } from "@app/components/appSidebar/components/sidebarCollections/components/sidebarCollectionCreateForm/utils/collectionCreateFormTypes"
import { getCollectionCreateFormSchema } from "@app/components/appSidebar/components/sidebarCollections/components/sidebarCollectionCreateForm/utils/collectionCreateFromSchema"
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

type ISidebarCollectionCreateFormProps = { onSubmit: () => void; onCancel: () => void }

export const SidebarCollectionCreateForm = ({ onSubmit, onCancel }: ISidebarCollectionCreateFormProps) => {
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

			onSubmit()
		},
		onError: () => {
			toast({
				title: t("components.navCollections.createForm.toast.error.title"),
				description: t("components.navCollections.createForm.toast.error.description"),
			})
		},
	})

	const isFormStateValid = form.formState.isValid

	// --- CALLBACKS ---

	const handleSubmit = useCallback(
		async (value: CollectionCreateFormState) => {
			await mutateCollectionCreate({
				body: { name: value.name },
			})
		},
		[mutateCollectionCreate],
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

				<div className="flex justify-end mt-4 gap-4">
					<Button type="button" variant="destructive" onClick={handleCancel}>
						{t("components.navCollection")}
					</Button>

					<Button type="submit" disabled={!isFormStateValid}>
						{t("components.navCollections.createForm.button")}
					</Button>
				</div>
			</Form>
		</FormProvider>
	)
}
