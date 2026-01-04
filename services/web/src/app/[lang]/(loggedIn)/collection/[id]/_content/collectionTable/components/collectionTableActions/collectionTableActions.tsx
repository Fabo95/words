import { Row } from "@tanstack/react-table"
import { Delete, Edit, MoreHorizontal, Trash2 } from "lucide-react"

import { DeleteTranslationFromCollectionDialogContent } from "@app/components/dialogs/deleteTranslationFromCollectionDialogContent"
import { DeleteTranslationDialogContent } from "@app/components/dialogs/deleteTranslationDialogContent"
import { TranslationForm } from "@app/components/forms/translationForm/translationForm"
import { CollectionTranslation } from "@app/app/[lang]/(loggedIn)/collection/[id]/_content/collectionTable/utils/collectionTableTypes"
import { Button } from "@app/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@app/components/ui/dropdown-menu"
import { useSidebar } from "@app/components/ui/sidebar"
import { useState } from "react"
import { useTranslations } from "next-intl"
import * as React from "react"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@app/components/ui/dialog"
import { $api } from "@app/utils/api/apiRequests"

type CollectionTableActionsProps = { row: Row<CollectionTranslation> }
export const CollectionTableActions = ({ row }: CollectionTableActionsProps) => {
	// --- STATE ---

	const t = useTranslations()

	const {
		data: { data: collections },
	} = $api.useSuspenseQuery("get", "/collection/wip1")

	const {
		data: { data: cefrLevels },
	} = $api.useSuspenseQuery("get", "/cefr-levels")

	const { isMobile } = useSidebar()

	const [isEditFormOpen, setIsEditFormOpen] = useState(false)

	const [isDeleteTranslationDialogOpen, setIsDeleteTranslationDialogOpen] = useState(false)
	const [isDeleteFromCollectionDialogOpen, setIsDeleteFromCollectionDialogOpen] = useState(false)

	// --- RENDER ---

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">{t("pages.collection.table.actions.dropdownTrigger")}</span>

						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					onClick={(e) => e.stopPropagation()}
					className="rounded-lg"
					side={isMobile ? "bottom" : "right"}
					align={isMobile ? "end" : "start"}
				>
					<DropdownMenuItem onClick={() => setIsEditFormOpen(true)}>
						<Edit className="text-muted-foreground" />
						<span>{t("pages.collection.table.actions.dropdownEditButton")}</span>
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DropdownMenuItem onClick={() => setIsDeleteFromCollectionDialogOpen(true)}>
						<Delete className="text-muted-foreground" />
						<span>{t("pages.collection.table.actions.dropdownDeleteFromCollectionButton")}</span>
					</DropdownMenuItem>

					<DropdownMenuItem onClick={() => setIsDeleteTranslationDialogOpen(true)}>
						<Trash2 className="text-muted-foreground" />
						<span>{t("pages.collection.table.actions.dropdownDeleteTranslationButton")}</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Dialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
				<DialogContent onClick={(e) => e.stopPropagation()}>
					<DialogHeader>
						<DialogTitle>{t("forms.translationForm.title")}</DialogTitle>

						<DialogDescription>{t("forms.translationForm.description")}</DialogDescription>
					</DialogHeader>

					{isEditFormOpen && (
						<TranslationForm
							cefrLevels={cefrLevels}
							collections={collections}
							translationId={row.original.translationId}
							formType="update"
							defaultValues={{
								sourceText: row.original.sourceText,
								targetText: row.original.targetText,
								collectionId: row.original.id,
								cefrLevelId: row.original.cefrLevel?.id,
							}}
							onSubmit={() => setIsEditFormOpen(false)}
							onCancel={() => setIsEditFormOpen(false)}
						/>
					)}
				</DialogContent>
			</Dialog>

			<Dialog open={isDeleteFromCollectionDialogOpen} onOpenChange={setIsDeleteFromCollectionDialogOpen}>
				<DeleteTranslationFromCollectionDialogContent
					id={row.original.id}
					translationId={row.original.translationId}
					handleIsDialogOpen={setIsDeleteFromCollectionDialogOpen}
				/>
			</Dialog>

			<Dialog open={isDeleteTranslationDialogOpen} onOpenChange={setIsDeleteTranslationDialogOpen}>
				<DeleteTranslationDialogContent
					id={row.original.id}
					translationId={row.original.translationId}
					handleIsDialogOpen={setIsDeleteTranslationDialogOpen}
				/>
			</Dialog>
		</>
	)
}
