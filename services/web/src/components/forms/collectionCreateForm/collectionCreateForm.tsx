import { CollectionCreateFormState } from "@app/components/forms/collectionCreateForm/utils/collectionCreateFormTypes"
import { getCollectionCreateFormSchema } from "@app/components/forms/collectionCreateForm/utils/collectionCreateFromSchema"
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
import { useIsMobile } from "@app/hooks/use-mobile"
import { getCollectionsQueryOptions } from "@app/utils/reactQuery/queryOptions"

type ISidebarCollectionCreateFormProps = { onSubmit: () => void; onCancel: () => void }

export const CollectionCreateForm = ({ onSubmit, onCancel }: ISidebarCollectionCreateFormProps) => {
	// --- STATE ---

	const { toast } = useToast()

	const isMobile = useIsMobile()

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
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: getCollectionsQueryOptions().queryKey })

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
			{/* @ts-ignore */}
			<Form onKeyDown={handleKeyDownSubmit} onSubmit={form.handleSubmit(handleSubmit)}>
				<FormField
					control={form.control}
					className="mb-8"
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

				<div
					className={
						isMobile ? "mt-auto flex flex-col gap-2" : "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2"
					}
				>
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
