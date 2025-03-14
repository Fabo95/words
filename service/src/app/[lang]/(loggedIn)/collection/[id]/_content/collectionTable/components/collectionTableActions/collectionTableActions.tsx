import { Row } from "@tanstack/react-table"
import { Delete, Edit, MoreHorizontal, Trash2 } from "lucide-react"

import { SidebarCollectionDeleteTranslationDialog } from "@app/app/[lang]/(loggedIn)/collection/[id]/_content/collectionTable/components/collectionTableActions/collectionTableDeleteTranslationDialog"
import { CollectionTranslation } from "@app/app/[lang]/(loggedIn)/collection/[id]/_content/collectionTable/utils/collectionTableTypes"
import { Button } from "@app/components/ui/button"
import { Dialog } from "@app/components/ui/dialog"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@app/components/ui/dropdown-menu"
import { useSidebar } from "@app/components/ui/sidebar"
import { useClientTFunction } from "@app/utils/i18n/utils/i18nHooks"
import { useState } from "react"

type CollectionTableActionsProps = { row: Row<CollectionTranslation> }
export const CollectionTableActions = ({ row }: CollectionTableActionsProps) => {
	// --- STATE ---

	const t = useClientTFunction()

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
					<DropdownMenuItem>
						<Edit className="text-muted-foreground" />
						<span>{t("pages.collection.table.actions.dropdownEditButton")}</span>
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DropdownMenuItem>
						<Delete className="text-muted-foreground" />
						<span>{t("pages.collection.table.actions.dropdownDeleteFromCollectionButton")}</span>
					</DropdownMenuItem>

					<DropdownMenuItem onClick={() => setIsDeleteTranslationDialogOpen(true)}>
						<Trash2 className="text-muted-foreground" />
						<span>{t("pages.collection.table.actions.dropdownDeleteTranslationButton")}</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Dialog open={isDeleteTranslationDialogOpen} onOpenChange={setIsDeleteTranslationDialogOpen}>
				<SidebarCollectionDeleteTranslationDialog
					translationId={row.original.translationId}
					handleIsDialogOpen={setIsDeleteTranslationDialogOpen}
				/>
			</Dialog>
		</>
	)
}
