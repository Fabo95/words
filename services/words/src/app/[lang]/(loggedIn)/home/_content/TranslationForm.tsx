"use client"

import * as React from "react"
import { useCallback } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"

import { Button } from "services/words/src/components/ui/button"
import { Form, FormProvider } from "services/words/src/components/ui/form"
import { FormField } from "services/words/src/components/ui/formField"
import { Input } from "services/words/src/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "services/words/src/components/ui/select"
import { useToast } from "services/words/src/components/ui/use-toast"
import { $api } from "services/words/src/utils/api/apiRequests"

import { TranslationFormState } from "services/words/src/app/[lang]/(loggedIn)/home/_content/utils/translationFormTypes"
import { getTranslationFormSchema } from "services/words/src/app/[lang]/(loggedIn)/home/_content/utils/translationFormSchema"
import { getLanguageOptions, Locale } from "services/words/src/utils/locale/localeTypes"

export const TranslationForm = () => {
	const { toast } = useToast()
	const {
		data: { response_object },
	} = $api.useSuspenseQuery("get", "/user/collections")
	const t = useTranslations()

	const { mutateAsync: mutateTranslationCreate } = $api.useMutation("post", "/translation", {
		onSuccess: () => {
			toast({
				title: t("pages.home.createTranslationForm.toast.success.title"),
				description: t("pages.home.createTranslationForm.toast.success.description"),
			})
		},
		onError: () => {
			toast({
				title: t("pages.home.createTranslationForm.toast.error.title"),
				description: t("pages.home.createTranslationForm.toast.error.description"),
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

	console.log("state", form.watch())

	const onSubmit = useCallback(
		async (value: TranslationFormState) => {
			await mutateTranslationCreate({
				body: {
					source_language: value.sourceLanguage,
					target_language: value.targetLanguage,
					source_text: value.sourceText,
					target_text: value.targetText,
					collection_id: value.collectionId,
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
						label={t("pages.home.createTranslationForm.sourceLanguageLabel")}
						name="sourceLanguage"
						render={({ field }) => (
							<Select
								value={field.value}
								onValueChange={(val) => {
									field.onChange(val)
								}}
							>
								<SelectTrigger className="h-8">
									<SelectValue placeholder={t("pages.home.createTranslationForm.sourceLanguagePlaceholder")} />
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
						label={t("pages.home.createTranslationForm.targetLanguageLabel")}
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
										placeholder={t("pages.home.createTranslationForm.targetLanguagePlaceholder") ?? "Select target"}
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
					label={t("pages.home.createTranslationForm.wordLabel")}
					name="sourceText"
					render={(fieldProps) => (
						<Input
							placeholder={t("pages.home.createTranslationForm.wordPlaceholder")}
							type="text"
							{...fieldProps.field}
						/>
					)}
				/>

				<FormField
					className="mb-3"
					control={form.control}
					label={t("pages.home.createTranslationForm.translationLabel")}
					name="targetText"
					render={(fieldProps) => (
						<Input
							placeholder={t("pages.home.createTranslationForm.translationPlaceholder")}
							type="text"
							{...fieldProps.field}
						/>
					)}
				/>

				<FormField
					className="mb-3"
					control={form.control}
					label={t("pages.home.createTranslationForm.collectionIdLabel")}
					description={t("pages.home.createTranslationForm.collectionDescription")}
					name="collectionId"
					render={({ field }) => (
						<Select
							value={field.value ? String(field.value) : ""}
							onValueChange={(value) => field.onChange(value ? Number(value) : undefined)}
						>
							<SelectTrigger className="h-8">
								<SelectValue placeholder={t("pages.home.createTranslationForm.collectionPlaceholder")} />
							</SelectTrigger>
							<SelectContent side="top">
								{response_object?.map((collection) => (
									<SelectItem key={collection.id} value={String(collection.id)}>
										{collection.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				/>

				<Button disabled={!form.formState.isValid} className="mt-5">
					{t("pages.home.createTranslationForm.saveButton")}
				</Button>
			</Form>
		</FormProvider>
	)
}
