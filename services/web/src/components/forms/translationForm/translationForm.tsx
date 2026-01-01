"use client"

import * as React from "react"

import { getTranslationFormSchema } from "@app/components/forms/translationForm/utils/translationFormSchema"
import { TranslationFormState } from "@app/components/forms/translationForm/utils/translationFormTypes"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@app/components/ui/select"
import { Badge } from "@app/components/ui/badge"
import { Locale } from "@app/utils/locale/localeTypes"
import { CefrLevel, Collection } from "@app/utils/types/api"

type TranslationFormProps = {
	cefrLevels: CefrLevel[] | undefined
	collections: Collection[] | undefined
	onSubmit: () => void
	onCancel: () => void
} & (
	| { defaultValues: Partial<TranslationFormState>; formType: "create" }
	| { translationId: number; defaultValues: TranslationFormState; formType: "update" }
)

export const TranslationForm = (props: TranslationFormProps) => {
	// --- HELPERS ---

	const isCreateForm = props.formType === "create"
	const isUpdateForm = props.formType === "update"

	// --- STATE ---

	const t = useTranslations()

	const { toast } = useToast()

	const queryClient = useQueryClient()

	const { mutateAsync: createTranslation } = $api.useMutation("post", "/translation", {
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["get", "/collection/{id}/translations"] })

			toast({
				title: t("forms.createTranslationForm.toast.success.title"),
				description: t("forms.createTranslationForm.toast.success.description"),
			})
		},
		onError: () => {
			toast({
				title: t("forms.createTranslationForm.toast.error.title"),
				description: t("forms.createTranslationForm.toast.error.description"),
			})
		},
	})

	const { mutateAsync: updateTranslation } = $api.useMutation("patch", "/translation/{id}", {
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["get", "/collection/{id}/translations"] })

			props.onSubmit()

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

	const form = useForm<TranslationFormState>({
		defaultValues: props.defaultValues,
		mode: "onBlur",
		resolver: zodResolver(getTranslationFormSchema(t)),
	})

	// --- CALLBACKS ---

	const onSubmit = useCallback(
		async (formState: TranslationFormState) => {
			try {
				const requestBody = {
					source_language: Locale.DE_DE,
					target_language: Locale.EN_GB,
					source_text: formState.sourceText,
					target_text: formState.targetText,
					collection_id: formState.collectionId,
					cefr_level_id: formState.cefrLevelId,
				}

				if (isCreateForm) {
					await createTranslation({ body: requestBody })
				}

				if (isUpdateForm) {
					await updateTranslation({
						body: requestBody,
						params: { path: { id: props.translationId } },
					})
				}

				toast({
					title: t("forms.translationForm.toast.success.title"),
					description: t("forms.translationForm.toast.success.description"),
				})

				await queryClient.invalidateQueries({ queryKey: ["get", "/collection/{id}/translations"] })

				form.reset()
				props.onSubmit()
			} catch (error) {
				toast({
					title: t("forms.translationForm.toast.error.title"),
					description: t("forms.translationForm.toast.error.description"),
				})
			}
		},
		[createTranslation, form, isCreateForm, isUpdateForm, props, queryClient, t, toast, updateTranslation],
	)

	// --- RENDER ---

	return (
		<FormProvider {...form}>
			<Form onSubmit={form.handleSubmit(onSubmit)}>
				<FormField
					className="mb-3"
					control={form.control}
					label={t("forms.translationForm.wordLabel")}
					name="sourceText"
					render={(fieldProps) => (
						<Input placeholder={t("forms.translationForm.wordPlaceholder")} type="text" {...fieldProps.field} />
					)}
				/>

				<FormField
					className="mb-3"
					control={form.control}
					label={t("forms.translationForm.translationLabel")}
					name="targetText"
					render={(fieldProps) => (
						<Input placeholder={t("forms.translationForm.translationPlaceholder")} type="text" {...fieldProps.field} />
					)}
				/>

				<FormField
					className="mb-3"
					control={form.control}
					label={t("forms.translationForm.collectionIdLabel")}
					description={t("forms.translationForm.collectionDescription")}
					name="collectionId"
					render={({ field }) => (
						<Select
							value={field.value ? String(field.value) : ""}
							onValueChange={(value) => field.onChange(value ? Number(value) : undefined)}
						>
							<SelectTrigger className="h-8">
								<SelectValue placeholder={t("forms.translationForm.collectionPlaceholder")} />
							</SelectTrigger>

							<SelectContent side="top">
								{props.collections?.map((collection) => (
									<SelectItem className="cursor-pointer" key={collection.id} value={String(collection.id)}>
										{collection.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				/>

				<FormField
					className="mb-3"
					control={form.control}
					label={t("forms.translationForm.cefrLevelIdLabel")}
					name="cefrLevelId"
					render={({ field }) => (
						<Select
							value={field.value ? String(field.value) : ""}
							onValueChange={(value) => field.onChange(value ? Number(value) : undefined)}
						>
							<SelectTrigger className="h-8">
								<SelectValue placeholder={t("forms.translationForm.cefrLevelIdPlaceholder")} />
							</SelectTrigger>

							<SelectContent side="top">
								{props.cefrLevels?.map((cefrLevel) => (
									<SelectItem className="cursor-pointer" key={cefrLevel.id} value={String(cefrLevel.id)}>
										<Badge variant="secondary" className="text-xs">
											{cefrLevel.code}
										</Badge>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				/>

				<div className="flex w-full gap-2">
					<Button className="mt-5" type="button" variant="secondary" onClick={() => props.onCancel()}>
						{t("forms.translationForm.cancelButton")}
					</Button>

					<Button className="mt-5" disabled={!form.formState.isValid || !form.formState.isDirty}>
						{t("forms.translationForm.saveButton")}
					</Button>
				</div>
			</Form>
		</FormProvider>
	)
}
