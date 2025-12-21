"use client"

import * as React from "react"
import { useCallback } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"

import { Button } from "@app/components/ui/button"
import { Form, FormProvider } from "@app/components/ui/form"
import { FormField } from "@app/components/ui/formField"
import { Input } from "@app/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@app/components/ui/select"
import { useToast } from "@app/components/ui/use-toast"
import { $api } from "@app/utils/api/apiRequests"

import { TranslationFormState } from "@app/components/forms/createTranslationForm/utils/translationFormTypes"
import { getTranslationFormSchema } from "@app/components/forms/createTranslationForm/utils/translationFormSchema"
import { getLanguageOptions, Locale } from "@app/utils/locale/localeTypes"
import { useQueryClient } from "@tanstack/react-query"

export const CreateTranslationForm = () => {
	const { toast } = useToast()

	const queryClient = useQueryClient()

	const {
		data: { response_object: collections },
	} = $api.useSuspenseQuery("get", "/user/collections")

	const t = useTranslations()

	const {
		data: { response_object: cefrLevels },
	} = $api.useSuspenseQuery("get", "/cefr-levels")

	const { mutateAsync: mutateTranslationCreate } = $api.useMutation("post", "/translation", {
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

	const form = useForm<TranslationFormState>({
		defaultValues: {
			sourceLanguage: Locale.DE_DE,
			targetLanguage: Locale.EN_GB,
			sourceText: "",
			targetText: "",
			collectionId: undefined,
		},
		mode: "onBlur",
		resolver: zodResolver(getTranslationFormSchema(t)),
	})

	const sourceLang = useWatch({ control: form.control, name: "sourceLanguage" })
	const targetLang = useWatch({ control: form.control, name: "targetLanguage" })

	const onSubmit = useCallback(
		async (value: TranslationFormState) => {
			await mutateTranslationCreate({
				body: {
					source_language: value.sourceLanguage,
					target_language: value.targetLanguage,
					source_text: value.sourceText,
					target_text: value.targetText,
					collection_id: value.collectionId,
					cefr_level_id: value.cefrLevelId,
				},
			})
		},
		[mutateTranslationCreate],
	)

	const swapLanguages = () => {
		const src = form.getValues("sourceLanguage")
		const tgt = form.getValues("targetLanguage")
		form.setValue("sourceLanguage", tgt, { shouldValidate: true })
		form.setValue("targetLanguage", src, { shouldValidate: true })
	}

	return (
		<FormProvider {...form}>
			<Form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="flex gap-3">
					<FormField
						className="mb-3 flex-1/2"
						control={form.control}
						label={t("forms.createTranslationForm.sourceLanguageLabel")}
						name="sourceLanguage"
						render={({ field }) => (
							<Select
								value={field.value}
								onValueChange={(val) => {
									field.onChange(val)
								}}
							>
								<SelectTrigger className="h-8">
									<SelectValue placeholder={t("forms.createTranslationForm.sourceLanguagePlaceholder")} />
								</SelectTrigger>
								<SelectContent side="top">
									{getLanguageOptions(t).map((opt) => (
										<SelectItem key={opt.value} value={opt.value} disabled={opt.value === targetLang}>
											{opt.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					/>

					<Button
						className="mt-6 h-8"
						type="button"
						variant="destructive"
						onClick={swapLanguages}
						aria-label="Swap languages"
					>
						⇄
					</Button>

					<FormField
						className="mb-3 flex-1/2"
						control={form.control}
						label={t("forms.createTranslationForm.targetLanguageLabel")}
						name="targetLanguage"
						render={({ field }) => (
							<Select
								value={field.value}
								onValueChange={(val) => {
									field.onChange(val)
								}}
							>
								<SelectTrigger className="h-8">
									<SelectValue
										placeholder={t("forms.createTranslationForm.targetLanguagePlaceholder") ?? "Select target"}
									/>
								</SelectTrigger>
								<SelectContent side="top">
									{getLanguageOptions(t).map((opt) => (
										<SelectItem key={opt.value} value={opt.value} disabled={opt.value === sourceLang}>
											{opt.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					/>
				</div>

				<FormField
					className="mb-3"
					control={form.control}
					label={t("forms.createTranslationForm.wordLabel")}
					name="sourceText"
					render={(fieldProps) => (
						<Input placeholder={t("forms.createTranslationForm.wordPlaceholder")} type="text" {...fieldProps.field} />
					)}
				/>

				<FormField
					className="mb-3"
					control={form.control}
					label={t("forms.createTranslationForm.translationLabel")}
					name="targetText"
					render={(fieldProps) => (
						<Input
							placeholder={t("forms.createTranslationForm.translationPlaceholder")}
							type="text"
							{...fieldProps.field}
						/>
					)}
				/>

				<FormField
					className="mb-3"
					control={form.control}
					label={t("forms.createTranslationForm.collectionIdLabel")}
					description={t("forms.createTranslationForm.collectionDescription")}
					name="collectionId"
					render={({ field }) => (
						<Select
							value={field.value ? String(field.value) : ""}
							onValueChange={(value) => field.onChange(value ? Number(value) : undefined)}
						>
							<SelectTrigger className="h-8">
								<SelectValue placeholder={t("forms.createTranslationForm.collectionPlaceholder")} />
							</SelectTrigger>

							<SelectContent side="top">
								{collections?.map((collection) => (
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
					label={t("forms.createTranslationForm.cefrLevelIdLabel")}
					name="cefrLevelId"
					render={({ field }) => (
						<Select
							value={field.value ? String(field.value) : ""}
							onValueChange={(value) => field.onChange(value ? Number(value) : undefined)}
						>
							<SelectTrigger className="h-8">
								<SelectValue placeholder={t("forms.createTranslationForm.cefrLevelIdPlaceholder")} />
							</SelectTrigger>

							<SelectContent side="top">
								{cefrLevels?.map((cefrLevel) => (
									<SelectItem className="cursor-pointer" key={cefrLevel.id} value={String(cefrLevel.id)}>
										{cefrLevel.code}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				/>

				<Button disabled={!form.formState.isValid} className="mt-5">
					{t("forms.createTranslationForm.saveButton")}
				</Button>
			</Form>
		</FormProvider>
	)
}
