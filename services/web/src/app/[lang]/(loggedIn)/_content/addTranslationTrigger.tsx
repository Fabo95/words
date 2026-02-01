"use client"

import { useState, useEffect, useRef } from "react"
import * as React from "react"
import { useTranslations } from "next-intl"
import { Button } from "@app/components/ui/button"
import { PlusIcon } from "@radix-ui/react-icons"
import { TranslationForm } from "@app/components/forms/translationForm/translationForm"
import { TranslationFormState } from "@app/components/forms/translationForm/utils/translationFormTypes"
import {
	DialogOrDrawer,
	DialogOrDrawerContent,
	DialogOrDrawerDescription,
	DialogOrDrawerHeader,
	DialogOrDrawerTitle,
} from "@app/components/ui/dialogOrDrawer"
import {
	getCefrLevelsQueryOptions,
	getCollectionsQueryOptions,
	getLatestTranslationsQueryOptions,
	getLearnStatsQueryOptions,
	getTranslationByIdQueryOptions,
	getTranslationStatisticsQueryOptions,
	getUniversalPosTagsQueryOptions,
} from "@app/utils/reactQuery/queryOptions"
import { useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { mapTranslationResponseToTranslation } from "@app/utils/types/api"
import { isTranslationEnriched } from "@app/components/forms/translationForm/translationEnrich"
import { useToast } from "@app/components/ui/use-toast"

type AddTranslationTriggerProps = {
	defaultValues?: Partial<TranslationFormState>
	title?: string
	className?: string
	size: "sm" | "icon"
	variant: "ghost" | "outline"
}

export const AddTranslationTrigger = ({
	defaultValues,
	title,
	className,
	size,
	variant,
}: AddTranslationTriggerProps) => {
	const t = useTranslations()
	const { toast } = useToast()
	const queryClient = useQueryClient()

	const [isTranslationFormOpen, setIsTranslationFormOpen] = useState(false)
	const [isEnriching, setIsEnriching] = useState(false)
	const [createdTranslationId, setCreatedTranslationId] = useState<number>()
	const hasShownEnrichmentToast = useRef(false)

	const {
		data: { data: collections },
	} = useSuspenseQuery(getCollectionsQueryOptions())

	const {
		data: { data: cefrLevels },
	} = useSuspenseQuery(getCefrLevelsQueryOptions())

	const {
		data: { data: universalPosTags },
	} = useSuspenseQuery(getUniversalPosTagsQueryOptions())

	const { data: addedTranslation } = useQuery({
		...getTranslationByIdQueryOptions(createdTranslationId ?? -1),
		enabled: isEnriching && typeof createdTranslationId === "number",
		refetchInterval: (q) => {
			const translation = q.state.data?.data
			if (!translation) return 1200
			return isTranslationEnriched(mapTranslationResponseToTranslation(translation)) ? false : 1200
		},
		select: (data) => (data.data ? mapTranslationResponseToTranslation(data.data) : undefined),
	})

	const isEnrichmentComplete = addedTranslation && isTranslationEnriched(addedTranslation)

	useEffect(() => {
		if (!isEnrichmentComplete || hasShownEnrichmentToast.current) {
			return
		}

		hasShownEnrichmentToast.current = true

		void Promise.all([
			queryClient.invalidateQueries({ queryKey: ["get", "/translation"] }),
			queryClient.invalidateQueries({ queryKey: ["get", "/collection/{id}/translations"] }),
			queryClient.invalidateQueries({ queryKey: getLatestTranslationsQueryOptions().queryKey }),
			queryClient.invalidateQueries({ queryKey: getTranslationStatisticsQueryOptions().queryKey }),
			queryClient.invalidateQueries({ queryKey: getLearnStatsQueryOptions().queryKey }),
			createdTranslationId
				? queryClient.invalidateQueries({ queryKey: getTranslationByIdQueryOptions(createdTranslationId).queryKey })
				: Promise.resolve(),
		])

		toast({
			title: t("forms.translationForm.enriching.toast.success.title"),
			description: t("forms.translationForm.enriching.toast.success.description"),
		})
	}, [isEnrichmentComplete, queryClient, createdTranslationId, toast, t])

	const handleEnrich = (translationId: number) => {
		setIsEnriching(true)
		setCreatedTranslationId(translationId)
		hasShownEnrichmentToast.current = false
	}

	const handleClose = () => {
		setIsTranslationFormOpen(false)
	}

	return (
		<>
			<Button
				className={className}
				data-sidebar="trigger"
				variant={variant}
				size={size}
				onClick={() => {
					// Reset state only if previous enrichment is complete
					if (isEnrichmentComplete) {
						setIsEnriching(false)
						setCreatedTranslationId(undefined)
						hasShownEnrichmentToast.current = false
					}
					setIsTranslationFormOpen(true)
				}}
			>
				<PlusIcon />

				{title && <span>{title}</span>}
			</Button>

			<DialogOrDrawer open={isTranslationFormOpen} onOpenChange={setIsTranslationFormOpen}>
				<DialogOrDrawerContent>
					<DialogOrDrawerHeader>
						{isEnriching ? (
							<DialogOrDrawerTitle>{t("forms.translationForm.enriching.title")}</DialogOrDrawerTitle>
						) : (
							<DialogOrDrawerTitle>{t("forms.translationForm.title")}</DialogOrDrawerTitle>
						)}

						{isEnriching ? (
							<DialogOrDrawerDescription>{t("forms.translationForm.enriching.description")}</DialogOrDrawerDescription>
						) : (
							<DialogOrDrawerDescription>{t("forms.translationForm.description")}</DialogOrDrawerDescription>
						)}
					</DialogOrDrawerHeader>

					{isTranslationFormOpen && (
						<TranslationForm
							universalPosTags={universalPosTags}
							cefrLevels={cefrLevels}
							collections={collections}
							onSubmit={handleClose}
							onCancel={handleClose}
							onEnrich={handleEnrich}
							isEnriching={isEnriching}
							addedTranslation={addedTranslation}
							formType="create"
							defaultValues={defaultValues ?? {}}
						/>
					)}
				</DialogOrDrawerContent>
			</DialogOrDrawer>
		</>
	)
}
