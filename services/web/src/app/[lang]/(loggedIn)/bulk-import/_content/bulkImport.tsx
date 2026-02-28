"use client"

import * as React from "react"
import { useCallback, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query"
import { Upload, Loader2, FileText, CheckCircle2 } from "lucide-react"

import { Button } from "@app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@app/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@app/components/ui/select"
import { useToast } from "@app/components/ui/use-toast"
import { $api } from "@app/utils/api/apiRequests"
import { getCollectionsQueryOptions } from "@app/utils/reactQuery/queryOptions"
import { Locale } from "@app/utils/locale/localeTypes"
import { useIsMobile } from "@app/hooks/use-mobile"

import { BulkImportMobile } from "@app/app/[lang]/(loggedIn)/bulk-import/_content/bulkImportMobile"
import { BulkImportTable } from "@app/app/[lang]/(loggedIn)/bulk-import/_content/bulkImportTable"
import type { BulkImportItem } from "@app/app/[lang]/(loggedIn)/bulk-import/_content/utils/bulkImportTypes"

type Step = "upload" | "processing" | "review" | "creating" | "success"

export const BulkImport = () => {
	// --- STATE ---

	const t = useTranslations()
	const { toast } = useToast()
	const queryClient = useQueryClient()

	const [step, setStep] = useState<Step>("upload")
	const [extractedTranslations, setExtractedTranslations] = useState<BulkImportItem[]>([])
	const [selectedCollectionId, setSelectedCollectionId] = useState<string>("")
	const [documentInfo, setDocumentInfo] = useState<{ filename: string; file_type: string } | null>(null)
	const [isDragOver, setIsDragOver] = useState(false)

	const isMobile = useIsMobile()

	const {
		data: { data: collections },
	} = useSuspenseQuery(getCollectionsQueryOptions())

	// --- MUTATIONS ---

	const { mutateAsync: extractTranslations } = $api.useMutation("post", "/bulk-import/extract")
	const { mutateAsync: createBulk } = $api.useMutation("post", "/bulk-import/create")

	// --- MEMOIZED DATA ---

	const selectedTranslations = useMemo(() => {
		return extractedTranslations.filter((t) => t.selected)
	}, [extractedTranslations])

	// --- CALLBACKS ---

	const handleFileUpload = useCallback(
		async (file: File) => {
			const MAX_FILE_SIZE = 1024 * 1024 // 1MB

			if (file.size > MAX_FILE_SIZE) {
				toast({
					title: t("pages.bulkImport.toast.fileTooLarge.title"),
					description: t("pages.bulkImport.toast.fileTooLarge.description"),
					variant: "destructive",
				})
				return
			}

			setStep("processing")

			try {
				const formData = new FormData()
				formData.append("file", file)
				formData.append("source_language", "German")
				formData.append("target_language", "English")

				const response = await extractTranslations({ body: formData })

				if (response?.data) {
					const data = response.data

					setExtractedTranslations(
						data.extracted_translations.map((item) => ({
							...item,
							selected: true,
						})),
					)
					setDocumentInfo(data.document_info)
					setStep("review")
				}
			} catch {
				toast({
					title: t("pages.bulkImport.toast.extractError.title"),
					description: t("pages.bulkImport.toast.extractError.description"),
					variant: "destructive",
				})
				setStep("upload")
			}
		},
		[extractTranslations, toast, t],
	)

	const handleDrop = useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault()
			setIsDragOver(false)

			const file = e.dataTransfer.files[0]
			if (file) {
				handleFileUpload(file)
			}
		},
		[handleFileUpload],
	)

	const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		setIsDragOver(true)
	}, [])

	const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		setIsDragOver(false)
	}, [])

	const handleFileInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0]
			if (file) {
				handleFileUpload(file)
			}
		},
		[handleFileUpload],
	)

	const handleToggleSelection = useCallback((index: number) => {
		setExtractedTranslations((prev) => prev.map((t, i) => (i === index ? { ...t, selected: !t.selected } : t)))
	}, [])

	const handleToggleAll = useCallback(() => {
		const allSelected = extractedTranslations.every((t) => t.selected)
		setExtractedTranslations((prev) => prev.map((t) => ({ ...t, selected: !allSelected })))
	}, [extractedTranslations])

	const handleEditSourceText = useCallback((index: number, value: string) => {
		setExtractedTranslations((prev) => prev.map((t, i) => (i === index ? { ...t, source_text: value } : t)))
	}, [])

	const handleEditTargetText = useCallback((index: number, value: string) => {
		setExtractedTranslations((prev) => prev.map((t, i) => (i === index ? { ...t, target_text: value } : t)))
	}, [])

	const handleImport = useCallback(async () => {
		setStep("creating")

		const translations = selectedTranslations.map((item) => ({
			source_language: Locale.DE_DE,
			target_language: Locale.EN_GB,
			source_text: item.source_text,
			target_text: item.target_text,
			collection_id: selectedCollectionId ? Number(selectedCollectionId) : null,
		}))

		try {
			const response = await createBulk({ body: { translations } })

			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ["get", "/translation"] }),
				queryClient.invalidateQueries({ queryKey: ["get", "/collection"] }),
			])

			const data = response?.data as { created_count: number } | undefined

			toast({
				title: t("pages.bulkImport.toast.importSuccess.title"),
				description: t("pages.bulkImport.toast.importSuccess.description", {
					count: data?.created_count ?? selectedTranslations.length,
				}),
			})

			setStep("success")
		} catch {
			toast({
				title: t("pages.bulkImport.toast.importError.title"),
				description: t("pages.bulkImport.toast.importError.description"),
				variant: "destructive",
			})
			setStep("review")
		}
	}, [selectedTranslations, selectedCollectionId, createBulk, queryClient, toast, t])

	const handleReset = useCallback(() => {
		setStep("upload")
		setExtractedTranslations([])
		setDocumentInfo(null)
		setSelectedCollectionId("")
	}, [])

	// --- RENDER ---

	return (
		<div className="w-full md:w-4/5 overflow-hidden">
			<h1 className="text-xl md:text-2xl mb-4 font-semibold tracking-tight">{t("pages.bulkImport.title")}</h1>

			{step === "upload" && (
				<Card>
					<CardHeader>
						<CardTitle className="mb-1">{t("pages.bulkImport.uploadTitle")}</CardTitle>
						<CardDescription>{t("pages.bulkImport.uploadDescription")}</CardDescription>
					</CardHeader>
					<CardContent>
						<div
							onDrop={handleDrop}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
								isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25"
							}`}
							onClick={() => document.getElementById("file-input")?.click()}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									document.getElementById("file-input")?.click()
								}
							}}
							role="button"
							tabIndex={0}
						>
							<Upload className="mx-auto h-6 w-6 text-muted-foreground mb-4" />
							<p className="font-medium mb-2">{t("pages.bulkImport.dragDrop")}</p>
							<p className="text-sm text-muted-foreground">{t("pages.bulkImport.supportedFormats")}</p>

							<input
								id="file-input"
								type="file"
								accept=".pdf,.docx,.txt,.csv,.jpg,.jpeg,.png,.webp,.gif"
								onChange={handleFileInputChange}
								className="hidden"
							/>
						</div>
					</CardContent>
				</Card>
			)}

			{step === "processing" && (
				<Card>
					<CardContent className="py-12">
						<div className="flex flex-col items-center justify-center">
							<Loader2 className="h-6 w-6 animate-spin text-primary mb-4" />
							<p className="font-medium">{t("pages.bulkImport.processing")}</p>
						</div>
					</CardContent>
				</Card>
			)}

			{step === "review" && (
				<Card>
					<CardHeader>
						<div className="flex flex-col gap-4 justify-between">
							<div>
								<CardTitle className="mb-1">{t("pages.bulkImport.reviewTitle")}</CardTitle>
								<CardDescription>{t("pages.bulkImport.reviewDescription")}</CardDescription>
							</div>

							{documentInfo && (
								<div className="flex gap-1 text-sm text-muted-foreground">
									<FileText className="h-4 w-4" />
									<span>{documentInfo.filename}</span>
								</div>
							)}
						</div>
					</CardHeader>

					<CardContent>
						{extractedTranslations.length === 0 ? (
							<div className="font-medium text-center">{t("pages.bulkImport.noTranslations")}</div>
						) : (
							<>
								<div className="mb-4">
									<Select value={selectedCollectionId} onValueChange={setSelectedCollectionId}>
										<SelectTrigger className="w-full md:w-64">
											<SelectValue placeholder={t("pages.bulkImport.collectionPlaceholder")} />
										</SelectTrigger>
										<SelectContent>
											{collections?.map((collection) => (
												<SelectItem key={collection.id} value={collection.id.toString()}>
													{collection.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								{isMobile ? (
									<BulkImportMobile
										items={extractedTranslations}
										selectedCount={selectedTranslations.length}
										onToggleSelection={handleToggleSelection}
										onToggleAll={handleToggleAll}
										onEditSourceText={handleEditSourceText}
										onEditTargetText={handleEditTargetText}
									/>
								) : (
									<BulkImportTable
										items={extractedTranslations}
										onToggleSelection={handleToggleSelection}
										onToggleAll={handleToggleAll}
										onEditSourceText={handleEditSourceText}
										onEditTargetText={handleEditTargetText}
									/>
								)}

								<div className="flex justify-between items-center mt-4">
									<Button variant="outline" onClick={handleReset}>
										{t("forms.translationForm.cancelButton")}
									</Button>

									<Button onClick={handleImport} disabled={selectedTranslations.length === 0}>
										{t("pages.bulkImport.importButton", { count: selectedTranslations.length })}
									</Button>
								</div>
							</>
						)}
					</CardContent>
				</Card>
			)}

			{step === "creating" && (
				<Card>
					<CardContent className="py-12">
						<div className="flex flex-col items-center justify-center">
							<Loader2 className="h-6 w-6 animate-spin text-primary mb-4" />
							<p className="font-medium">
								{t("pages.bulkImport.importButton", { count: selectedTranslations.length })}...
							</p>
						</div>
					</CardContent>
				</Card>
			)}

			{step === "success" && (
				<Card>
					<CardContent className="py-12">
						<div className="flex flex-col items-center justify-center">
							<CheckCircle2 className="h-6 w-6 text-green-500 mb-4" />
							<p className="font-medium mb-4">{t("pages.bulkImport.toast.importSuccess.title")}</p>
							<Button onClick={handleReset}>{t("pages.bulkImport.uploadTitle")}</Button>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	)
}
