import { Row } from "@tanstack/react-table"
import { Delete, Edit, MoreHorizontal, Trash2 } from "lucide-react"

import { CollectionTableDeleteFromCollectionDialog } from "@app/app/[lang]/(loggedIn)/collection/[id]/_content/collectionTable/components/collectionTableActions/collectionTableDeleteFromCollectionDialog"
import { CollectionTableDeleteTranslationDialog } from "@app/app/[lang]/(loggedIn)/collection/[id]/_content/collectionTable/components/collectionTableActions/collectionTableDeleteTranslationDialog"
import { CollectionTableEditTranslationForm } from "@app/app/[lang]/(loggedIn)/collection/[id]/_content/collectionTable/components/collectionTableActions/collectionTableEditTranslationForm/collectionTableEditTranslationForm"
import { CollectionTranslation } from "@app/app/[lang]/(loggedIn)/collection/[id]/_content/collectionTable/utils/collectionTableTypes"
import { Button } from "@app/components/ui/button"
import { Dialog, DialogDescription, DialogHeader, DialogTitle } from "@app/components/ui/dialog"
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
import { DialogContent } from "@radix-ui/react-dialog"

type CollectionTableActionsProps = { row: Row<CollectionTranslation> }
export const CollectionTableActions = ({ row }: CollectionTableActionsProps) => {
	// --- STATE ---

	const t = useTranslations()

	const { isMobile } = useSidebar()

	const [isEditFormOpen, setIsEditFormOpen] = useState(false)

	const [isDeleteTranslationDialogOpen, setIsDeleteTranslationDialogOpen] = useState(false)
	const [isDeleteFromCollectionDialogOpen, setIsDeleteFromCollectionDialogOpen] = useState(false)

	// --- RENDER ---

	console.log(row.original.id)

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
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t("pages.collection.table.editTranslationForm.title")}</DialogTitle>

						<DialogDescription>{t("pages.collection.table.editTranslationForm.description")}</DialogDescription>
					</DialogHeader>
					{isEditFormOpen && (
						<CollectionTableEditTranslationForm
							id={row.original.id}
							translationId={row.original.translationId}
							sourceText={row.original.sourceText}
							targetText={row.original.targetText}
							handleIsDialogOpen={setIsEditFormOpen}
						/>
					)}
				</DialogContent>
			</Dialog>

			<Dialog open={isDeleteFromCollectionDialogOpen} onOpenChange={setIsDeleteFromCollectionDialogOpen}>
				<CollectionTableDeleteFromCollectionDialog
					id={row.original.id}
					translationId={row.original.translationId}
					handleIsDialogOpen={setIsDeleteFromCollectionDialogOpen}
				/>
			</Dialog>

			<Dialog open={isDeleteTranslationDialogOpen} onOpenChange={setIsDeleteTranslationDialogOpen}>
				<CollectionTableDeleteTranslationDialog
					id={row.original.id}
					translationId={row.original.translationId}
					handleIsDialogOpen={setIsDeleteTranslationDialogOpen}
				/>
			</Dialog>
		</>
	)
}
