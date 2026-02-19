import { CollectionEditFormState } from "@app/components/forms/collectionEditForm/utils/collectionEditFormTypes"
import { getCollectionEditFormSchema } from "@app/components/forms/collectionEditForm/utils/collectionEditFromSchema"
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
import {
	getCollectionByIdQueryOptions,
	getCollectionsQueryOptions,
	getLatestTranslationsQueryOptions,
} from "@app/utils/reactQuery/queryOptions"

type ISidebarCollectionEditFormProps = {
	id: number
	defaultValues: CollectionEditFormState
	onSubmit: () => void
	onCancel: () => void
}

export const CollectionEditForm = ({ id, defaultValues, onCancel, onSubmit }: ISidebarCollectionEditFormProps) => {
	// --- STATE ---

	const { toast } = useToast()

	console.log("id", id)

	const isMobile = useIsMobile()

	const t = useTranslations()

	const queryClient = useQueryClient()

	const form = useForm<CollectionEditFormState>({
		defaultValues,
		mode: "onBlur",
		resolver: zodResolver(getCollectionEditFormSchema(t)),
	})

	const { mutateAsync: mutateCollectionEdit } = $api.useMutation("patch", "/collection/{id}", {
		onSuccess: async (data) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: getCollectionByIdQueryOptions(Number(data.data?.id)).queryKey }),
				queryClient.invalidateQueries({ queryKey: getCollectionsQueryOptions().queryKey }),
				queryClient.invalidateQueries({
					queryKey: ["get", "/collection/{id}/translations"],
				}),
				queryClient.invalidateQueries({ queryKey: getLatestTranslationsQueryOptions().queryKey }),
			])

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
			{/* @ts-ignore */}
			<Form onKeyDown={handleKeyDownSubmit} onSubmit={form.handleSubmit(handleSubmit)}>
				<FormField
					control={form.control}
					label={t("components.navCollections.editForm.label")}
					className="mb-8"
					name="name"
					render={(fieldProps) => (
						<Input
							placeholder={t("components.navCollections.editForm.placeholder")}
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
						{t("components.navCollections.editForm.button")}
					</Button>
				</div>
			</Form>
		</FormProvider>
	)
}
