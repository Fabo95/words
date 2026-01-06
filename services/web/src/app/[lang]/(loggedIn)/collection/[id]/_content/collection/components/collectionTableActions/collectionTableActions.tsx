import { Row } from "@tanstack/react-table"
import { Delete, Edit, MoreHorizontal, Trash2 } from "lucide-react"

import { DeleteTranslationFromCollectionContent } from "@app/components/dialogsOrDrawers/deleteTranslationFromCollectionContent"
import { DeleteTranslationContent } from "@app/components/dialogsOrDrawers/deleteTranslationContent"
import { TranslationForm } from "@app/components/forms/translationForm/translationForm"
import { CollectionTranslation } from "@app/app/[lang]/(loggedIn)/collection/[id]/_content/collection/utils/collectionTableTypes"
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

import { $api } from "@app/utils/api/apiRequests"
import {
	DialogOrDrawer,
	DialogOrDrawerContent,
	DialogOrDrawerDescription,
	DialogOrDrawerHeader,
	DialogOrDrawerTitle,
} from "@app/components/ui/dialogOrDrawer"

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

			<DialogOrDrawer open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
				<DialogOrDrawerContent onClick={(e) => e.stopPropagation()}>
					<DialogOrDrawerHeader>
						<DialogOrDrawerTitle>{t("forms.translationForm.title")}</DialogOrDrawerTitle>

						<DialogOrDrawerDescription>{t("forms.translationForm.description")}</DialogOrDrawerDescription>
					</DialogOrDrawerHeader>

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
				</DialogOrDrawerContent>
			</DialogOrDrawer>

			<DialogOrDrawer open={isDeleteFromCollectionDialogOpen} onOpenChange={setIsDeleteFromCollectionDialogOpen}>
				<DeleteTranslationFromCollectionContent
					id={row.original.id}
					translationId={row.original.translationId}
					handleIsDialogOpen={setIsDeleteFromCollectionDialogOpen}
				/>
			</DialogOrDrawer>

			<DialogOrDrawer open={isDeleteTranslationDialogOpen} onOpenChange={setIsDeleteTranslationDialogOpen}>
				<DeleteTranslationContent
					id={row.original.id}
					translationId={row.original.translationId}
					handleIsDialogOpen={setIsDeleteTranslationDialogOpen}
				/>
			</DialogOrDrawer>
		</>
	)
}
