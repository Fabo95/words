"use client"

import * as React from "react"

import { getEditTranslationFormSchema } from "@app/app/[lang]/(loggedIn)/collection/[id]/_content/collectionTable/components/collectionTableActions/collectionTableEditTranslationForm/utils/collectionTableEditTranslationFormSchema"
import { EditTranslationFormState } from "@app/app/[lang]/(loggedIn)/collection/[id]/_content/collectionTable/components/collectionTableActions/collectionTableEditTranslationForm/utils/collectionTableEditTranslationFormTypes"
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

type CollectionTableEditTranslationFormProps = {
	id: number
	translationId: number
	sourceText: string
	targetText: string
	handleIsDialogOpen: (isOpen: boolean) => void
}

export const CollectionTableEditTranslationForm = ({
	id,
	translationId,
	sourceText,
	targetText,
	handleIsDialogOpen,
}: CollectionTableEditTranslationFormProps) => {
	// --- STATE ---

	const t = useTranslations()

	const { toast } = useToast()

	const queryClient = useQueryClient()

	const { mutateAsync: mutateTranslationUpdate } = $api.useMutation("patch", "/translation/{id}", {
		onSuccess: (data) => {
			queryClient.setQueryData(
				["get", "/collection/{id}/translations", { params: { path: { id } } }],
				(oldData: { response_object: unknown[] }) => {
					console.log("oldData", oldData)
					return oldData
						? {
								...oldData,
								response_object: oldData.response_object.map((translation) => {
									if (translation.id !== translationId) {
										return translation
									}

									return data.response_object
								}),
							}
						: oldData
				},
			)

			handleIsDialogOpen(false)

			toast({
				title: t("pages.account.name.toast.success.title"),
				description: t("pages.account.name.toast.success.description"),
			})
		},
		onError: () => {
			toast({
				title: t("pages.account.name.toast.error.title"),
				description: t("pages.account.name.toast.error.description"),
			})
		},
	})

	const form = useForm<EditTranslationFormState>({
		defaultValues: {
			sourceText,
			targetText,
		},
		mode: "onBlur",
		resolver: zodResolver(getEditTranslationFormSchema(t)),
	})

	// --- CALLBACKS ---

	const onSubmit = useCallback(
		async (value: EditTranslationFormState) => {
			console.log("run???", value)
			await mutateTranslationUpdate({
				body: { source_text: value.sourceText, target_text: value.targetText },
				params: { path: { id: translationId } },
			})
		},
		[mutateTranslationUpdate, translationId],
	)

	// --- RENDER ---

	return (
		<FormProvider {...form}>
			<Form onSubmit={form.handleSubmit(onSubmit)}>
				<FormField
					className="mb-5"
					control={form.control}
					label={t("pages.collection.table.editTranslationForm.wordLabel")}
					name="sourceText"
					render={(fieldProps) => (
						<Input
							placeholder={t("pages.collection.table.editTranslationForm.wordPlaceholder")}
							type="text"
							{...fieldProps.field}
						/>
					)}
				/>

				<FormField
					control={form.control}
					label={t("pages.collection.table.editTranslationForm.translationLabel")}
					name="targetText"
					render={(fieldProps) => (
						<Input
							placeholder={t("pages.collection.table.editTranslationForm.translationPlaceholder")}
							type="text"
							{...fieldProps.field}
						/>
					)}
				/>

				<Button className="mt-5" type="button" variant="secondary" onClick={() => handleIsDialogOpen(false)}>
					{t("pages.collection.table.editTranslationForm.cancelButton")}
				</Button>

				<Button className="mt-5" disabled={!form.formState.isValid || !form.formState.isDirty}>
					{t("pages.collection.table.editTranslationForm.saveButton")}
				</Button>
			</Form>
		</FormProvider>
	)
}
