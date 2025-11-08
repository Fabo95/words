"use client"

import * as React from "react"

import { getEditTranslationFormSchema } from "@app/components/forms/editTranslationForm/utils/collectionTableEditTranslationFormSchema"
import { EditTranslationFormState } from "@app/components/forms/editTranslationForm/utils/collectionTableEditTranslationFormTypes"
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

type EditTranslationFormProps = {
	id: number
	translationId: number
	sourceText: string
	targetText: string
	handleIsDialogOpen: (isOpen: boolean) => void
}

export const EditTranslationForm = ({
	id,
	translationId,
	sourceText,
	targetText,
	handleIsDialogOpen,
}: EditTranslationFormProps) => {
	// --- STATE ---

	const t = useTranslations()

	const { toast } = useToast()

	const queryClient = useQueryClient()

	const { mutateAsync: mutateTranslationUpdate } = $api.useMutation("patch", "/translation/{id}", {
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["/translation/{id}", "/collection/{id}/translations"] })

			handleIsDialogOpen(false)

			toast({
				title: t("forms.accountNameForm.toast.success.title"),
				description: t("forms.accountNameForm.toast.success.description"),
			})
		},
		onError: () => {
			toast({
				title: t("forms.accountNameForm.toast.error.title"),
				description: t("forms.accountNameForm.toast.error.description"),
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
					label={t("forms.editTranslationForm.wordLabel")}
					name="sourceText"
					render={(fieldProps) => (
						<Input placeholder={t("forms.editTranslationForm.wordPlaceholder")} type="text" {...fieldProps.field} />
					)}
				/>

				<FormField
					control={form.control}
					label={t("forms.editTranslationForm.translationLabel")}
					name="targetText"
					render={(fieldProps) => (
						<Input
							placeholder={t("forms.editTranslationForm.translationPlaceholder")}
							type="text"
							{...fieldProps.field}
						/>
					)}
				/>

				<div className="flex w-full gap-2">
					<Button className="mt-5" type="button" variant="secondary" onClick={() => handleIsDialogOpen(false)}>
						{t("forms.editTranslationForm.cancelButton")}
					</Button>

					<Button className="mt-5" disabled={!form.formState.isValid || !form.formState.isDirty}>
						{t("forms.editTranslationForm.saveButton")}
					</Button>
				</div>
			</Form>
		</FormProvider>
	)
}
