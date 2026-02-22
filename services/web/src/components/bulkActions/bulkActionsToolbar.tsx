"use client"

import * as React from "react"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { useQueryClient } from "@tanstack/react-query"
import { Trash2, FolderInput, FolderMinus, Download, X } from "lucide-react"

import { Button } from "@app/components/ui/button"
import {
	DialogOrDrawer,
	DialogOrDrawerContent,
	DialogOrDrawerDescription,
	DialogOrDrawerFooter,
	DialogOrDrawerHeader,
	DialogOrDrawerTitle,
} from "@app/components/ui/dialogOrDrawer"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@app/components/ui/select"
import { useToast } from "@app/components/ui/use-toast"
import { $api } from "@app/utils/api/apiRequests"

type Collection = {
	id: number
	name: string
}

type BulkItem = {
	translationId: number
	sourceText: string
	targetText: string
	collectionId?: number
	collectionName?: string
	cefrLevel?: { code: string }
	universalPosTags: { code: string }[]
}

type BulkActionsToolbarProps = {
	selectedItems: BulkItem[]
	collections: Collection[]
	onClearSelection: () => void
	/** Current collection ID if on a collection page - enables "Remove from collection" */
	currentCollectionId?: number
}

export function BulkActionsToolbar({
	selectedItems,
	collections,
	onClearSelection,
	currentCollectionId,
}: BulkActionsToolbarProps) {
	const t = useTranslations()
	const { toast } = useToast()
	const queryClient = useQueryClient()

	const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false)
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false)
	const [selectedCollectionId, setSelectedCollectionId] = useState<string>("")
	const [isLoading, setIsLoading] = useState(false)

	const selectedCount = selectedItems.length
	const isCollectionPage = currentCollectionId !== undefined

	const { mutateAsync: updateTranslation } = $api.useMutation("patch", "/translation/{id}")
	const { mutateAsync: deleteTranslation } = $api.useMutation("delete", "/translation/{id}")

	const invalidateQueries = async () => {
		await queryClient.invalidateQueries({ queryKey: ["get", "/translation"] })
		await queryClient.invalidateQueries({ queryKey: ["get", "/collection"] })
	}

	const handleMoveToCollection = async () => {
		if (!selectedCollectionId) return

		setIsLoading(true)
		try {
			const collectionId = selectedCollectionId === "none" ? null : Number(selectedCollectionId)

			await Promise.all(
				selectedItems.map((item) =>
					updateTranslation({
						params: { path: { id: item.translationId } },
						body: { collection_id: collectionId },
					}),
				),
			)

			await invalidateQueries()

			toast({
				title: t("components.bulkActions.move.toast.success.title"),
				description: t("components.bulkActions.move.toast.success.description", { count: selectedCount }),
			})

			setIsMoveDialogOpen(false)
			setSelectedCollectionId("")
			onClearSelection()
		} catch {
			toast({
				title: t("components.bulkActions.move.toast.error.title"),
				description: t("components.bulkActions.move.toast.error.description"),
				variant: "destructive",
			})
		} finally {
			setIsLoading(false)
		}
	}

	const handleRemoveFromCollection = async () => {
		setIsLoading(true)
		try {
			await Promise.all(
				selectedItems.map((item) =>
					updateTranslation({
						params: { path: { id: item.translationId } },
						body: { collection_id: null },
					}),
				),
			)

			await invalidateQueries()

			toast({
				title: t("components.bulkActions.remove.toast.success.title"),
				description: t("components.bulkActions.remove.toast.success.description", { count: selectedCount }),
			})

			setIsRemoveDialogOpen(false)
			onClearSelection()
		} catch {
			toast({
				title: t("components.bulkActions.remove.toast.error.title"),
				description: t("components.bulkActions.remove.toast.error.description"),
				variant: "destructive",
			})
		} finally {
			setIsLoading(false)
		}
	}

	const handleBulkDelete = async () => {
		setIsLoading(true)
		try {
			await Promise.all(
				selectedItems.map((item) =>
					deleteTranslation({
						params: { path: { id: item.translationId } },
					}),
				),
			)

			await invalidateQueries()

			toast({
				title: t("components.bulkActions.delete.toast.success.title"),
				description: t("components.bulkActions.delete.toast.success.description", { count: selectedCount }),
			})

			setIsDeleteDialogOpen(false)
			onClearSelection()
		} catch {
			toast({
				title: t("components.bulkActions.delete.toast.error.title"),
				description: t("components.bulkActions.delete.toast.error.description"),
				variant: "destructive",
			})
		} finally {
			setIsLoading(false)
		}
	}

	const handleExport = () => {
		const headers = ["Source", "Translation", "Collection", "CEFR Level", "POS Tags"]
		const rows = selectedItems.map((item) => [
			item.sourceText,
			item.targetText,
			item.collectionName ?? "",
			item.cefrLevel?.code ?? "",
			item.universalPosTags.map((tag) => tag.code).join(", "),
		])

		const csvContent = [
			headers.join(","),
			...rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")),
		].join("\n")

		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
		const url = URL.createObjectURL(blob)
		const link = document.createElement("a")
		link.setAttribute("href", url)
		link.setAttribute("download", `vocabulary-export-${new Date().toISOString().split("T")[0]}.csv`)
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
		URL.revokeObjectURL(url)

		toast({
			title: t("components.bulkActions.export.toast.success.title"),
			description: t("components.bulkActions.export.toast.success.description", { count: selectedCount }),
		})
	}

	if (selectedCount === 0) return null

	return (
		<>
			<div className="flex flex-wrap items-center gap-2 p-3 mb-3 bg-muted/50 rounded-lg border">
				<span className="text-sm font-medium">{t("components.bulkActions.selected", { count: selectedCount })}</span>

				<div className="flex-1" />

				<div className="flex flex-wrap items-center gap-2">
					<Button variant="outline" size="sm" onClick={() => setIsMoveDialogOpen(true)}>
						<FolderInput className="h-4 w-4 mr-2" />
						{t("components.bulkActions.move.button")}
					</Button>

					<Button variant="outline" size="sm" onClick={handleExport}>
						<Download className="h-4 w-4 mr-2" />
						{t("components.bulkActions.export.button")}
					</Button>

					{isCollectionPage && (
						<Button variant="outline" size="sm" onClick={() => setIsRemoveDialogOpen(true)}>
							<FolderMinus className="h-4 w-4 mr-2" />
							{t("components.bulkActions.remove.button")}
						</Button>
					)}

					<Button variant="outline" size="sm" onClick={() => setIsDeleteDialogOpen(true)}>
						<Trash2 className="h-4 w-4 mr-2" />
						{t("components.bulkActions.delete.button")}
					</Button>

					<Button variant="ghost" size="icon" onClick={onClearSelection} className="h-8 w-8">
						<X className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* Move to Collection Dialog */}
			<DialogOrDrawer open={isMoveDialogOpen} onOpenChange={setIsMoveDialogOpen}>
				<DialogOrDrawerContent>
					<DialogOrDrawerHeader>
						<DialogOrDrawerTitle>{t("components.bulkActions.move.dialog.title")}</DialogOrDrawerTitle>
						<DialogOrDrawerDescription>
							{t("components.bulkActions.move.dialog.description", { count: selectedCount })}
						</DialogOrDrawerDescription>
					</DialogOrDrawerHeader>

					<div className="p-4 md:p-0">
						<Select value={selectedCollectionId} onValueChange={setSelectedCollectionId}>
							<SelectTrigger>
								<SelectValue placeholder={t("components.bulkActions.move.dialog.placeholder")} />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="none">{t("components.bulkActions.move.dialog.noCollection")}</SelectItem>
								{collections.map((collection) => (
									<SelectItem key={collection.id} value={collection.id.toString()}>
										{collection.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<DialogOrDrawerFooter>
						<Button variant="outline" onClick={() => setIsMoveDialogOpen(false)}>
							{t("components.bulkActions.move.dialog.cancel")}
						</Button>
						<Button onClick={handleMoveToCollection} disabled={!selectedCollectionId} isLoading={isLoading}>
							{t("components.bulkActions.move.dialog.confirm")}
						</Button>
					</DialogOrDrawerFooter>
				</DialogOrDrawerContent>
			</DialogOrDrawer>

			{/* Remove from Collection Dialog */}
			<DialogOrDrawer open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
				<DialogOrDrawerContent>
					<DialogOrDrawerHeader>
						<DialogOrDrawerTitle>{t("components.bulkActions.remove.dialog.title")}</DialogOrDrawerTitle>
						<DialogOrDrawerDescription>
							{t("components.bulkActions.remove.dialog.description", { count: selectedCount })}
						</DialogOrDrawerDescription>
					</DialogOrDrawerHeader>

					<DialogOrDrawerFooter>
						<Button variant="outline" onClick={() => setIsRemoveDialogOpen(false)}>
							{t("components.bulkActions.remove.dialog.cancel")}
						</Button>
						<Button onClick={handleRemoveFromCollection} isLoading={isLoading}>
							{t("components.bulkActions.remove.dialog.confirm")}
						</Button>
					</DialogOrDrawerFooter>
				</DialogOrDrawerContent>
			</DialogOrDrawer>

			{/* Delete Confirmation Dialog */}
			<DialogOrDrawer open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
				<DialogOrDrawerContent>
					<DialogOrDrawerHeader>
						<DialogOrDrawerTitle>{t("components.bulkActions.delete.dialog.title")}</DialogOrDrawerTitle>
						<DialogOrDrawerDescription>
							{t("components.bulkActions.delete.dialog.description", { count: selectedCount })}
						</DialogOrDrawerDescription>
					</DialogOrDrawerHeader>

					<DialogOrDrawerFooter>
						<Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
							{t("components.bulkActions.delete.dialog.cancel")}
						</Button>
						<Button variant="destructive" onClick={handleBulkDelete} isLoading={isLoading}>
							{t("components.bulkActions.delete.dialog.confirm")}
						</Button>
					</DialogOrDrawerFooter>
				</DialogOrDrawerContent>
			</DialogOrDrawer>
		</>
	)
}
