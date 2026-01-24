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
import { CefrLevel, Collection, Translation, UniversalPosTag } from "@app/utils/types/api"
import { useIsMobile } from "@app/hooks/use-mobile"
import {
	getLatestTranslationsQueryOptions,
	getTranslationByIdQueryOptions,
	getTranslationsQueryOptions,
} from "@app/utils/reactQuery/queryOptions"
import { Cross2Icon } from "@radix-ui/react-icons"
import { TranslationEnrich } from "@app/components/forms/translationForm/translationEnrich"

type TranslationFormProps = {
	cefrLevels: CefrLevel[] | undefined
	universalPosTags: UniversalPosTag[] | undefined
	collections: Collection[] | undefined
	onSubmit: () => void
	onCancel: () => void
	onEnrich?: (translationId: number) => void
	isEnriching?: boolean
	addedTranslation?: Translation
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

	const isMobile = useIsMobile()

	const queryClient = useQueryClient()

	const { mutateAsync: createTranslation, isPending } = $api.useMutation("post", "/translation", {
		onSuccess: async (data) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ["get", "/translation"] }),
				queryClient.invalidateQueries({ queryKey: ["get", "/collection/{id}/translations"] }),
				queryClient.invalidateQueries({ queryKey: getLatestTranslationsQueryOptions().queryKey }),
				queryClient.invalidateQueries({ queryKey: getTranslationByIdQueryOptions(data.data?.id ?? -1).queryKey }),
			])

			toast({
				title: t("forms.translationForm.toast.success.title"),
				description: t("forms.translationForm.toast.success.description"),
			})

			if (data.data?.id) {
				props.onEnrich?.(data.data.id)
			}
		},
		onError: () => {
			toast({
				title: t("forms.translationForm.toast.error.title"),
				description: t("forms.translationForm.toast.error.description"),
			})
		},
	})

	const { mutateAsync: updateTranslation } = $api.useMutation("patch", "/translation/{id}", {
		onSuccess: async (data) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ["get", "/translation"] }),
				queryClient.invalidateQueries({ queryKey: ["get", "/collection/{id}/translations"] }),
				queryClient.invalidateQueries({ queryKey: getLatestTranslationsQueryOptions().queryKey }),
				queryClient.invalidateQueries({ queryKey: getTranslationByIdQueryOptions(data.data?.id ?? -1).queryKey }),
			])

			props.onSubmit()
			form.reset()

			toast({
				title: t("forms.translationForm.toast.success.title"),
				description: t("forms.translationForm.toast.success.description"),
			})
		},
		onError: () => {
			toast({
				title: t("forms.translationForm.toast.error.title"),
				description: t("forms.translationForm.toast.error.description"),
			})
		},
	})

	const form = useForm<TranslationFormState>({
		defaultValues: props.defaultValues,
		mode: "onBlur",
		resolver: zodResolver(getTranslationFormSchema(t)),
	})

	const handleEnrichComplete = useCallback(() => {
		props.onSubmit()
		form.reset()
	}, [props, form])

	// --- CALLBACKS ---

	const onSubmit = useCallback(
		async (formState: TranslationFormState) => {
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
		},
		[createTranslation, isCreateForm, isUpdateForm, props, updateTranslation],
	)

	// --- RENDER ---

	if (props.isEnriching && props.addedTranslation) {
		return <TranslationEnrich translation={props.addedTranslation} onComplete={handleEnrichComplete} />
	}

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
					className={isCreateForm ? "mb-8" : "mb-3"}
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
										<Badge variant="secondary" className="text-xs">
											{collection.name}
										</Badge>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				/>

				{isUpdateForm && (
					<>
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

						<FormField
							className="mb-8"
							control={form.control}
							label={t("forms.translationForm.universalPosTagIdsLabel")}
							name="universalPosTagIds"
							render={({ field }) => (
								<Select
									// biome-ignore lint/nursery/useConsistentCurlyBraces: <explanation>
									value={""}
									onValueChange={(value) => field.onChange([...field.value, Number(value)])}
								>
									<SelectTrigger className="h-8">
										<SelectValue placeholder={t("forms.translationForm.universalPosTagIdsPlaceholder")} />
									</SelectTrigger>

									{field.value?.length > 0 ? (
										<div className="flex flex-wrap gap-2">
											{field.value.map((id) => {
												const tag = props.universalPosTags?.find((t) => t.id === id)
												if (!tag) return null

												return (
													<Badge key={tag.id} variant="secondary" className="text-xs flex items-center gap-1 pr-1">
														<span>{tag.name}</span>

														<Button
															type="button"
															variant="ghost"
															size="icon"
															className="h-5 w-5 rounded-full"
															onClick={() => field.onChange(field.value.filter((x) => x !== id))}
														>
															<Cross2Icon className="h-3 w-3" />
														</Button>
													</Badge>
												)
											})}
										</div>
									) : null}

									<SelectContent side="top">
										{props.universalPosTags
											?.filter((universalPosTag) => !field.value.includes(universalPosTag.id))
											?.map((universalPosTag) => (
												<SelectItem
													className="cursor-pointer"
													key={universalPosTag.id}
													value={String(universalPosTag.id)}
												>
													<Badge variant="secondary" className="text-xs">
														{universalPosTag.name}
													</Badge>
												</SelectItem>
											))}
									</SelectContent>
								</Select>
							)}
						/>
					</>
				)}

				<div
					className={
						isMobile ? "mt-auto flex flex-col gap-2" : "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2"
					}
				>
					<Button type="button" variant="secondary" onClick={() => props.onCancel()}>
						{t("forms.translationForm.cancelButton")}
					</Button>

					<Button isLoading={isPending} disabled={!form.formState.isValid || !form.formState.isDirty}>
						{t("forms.translationForm.saveButton")}
					</Button>
				</div>
			</Form>
		</FormProvider>
	)
}
