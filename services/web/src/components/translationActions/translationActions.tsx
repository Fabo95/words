import { Delete, Edit, MoreHorizontal, Trash2 } from "lucide-react"

import { DeleteTranslationFromCollectionContent } from "@app/components/dialogsOrDrawers/deleteTranslationFromCollectionContent"
import { DeleteTranslationContent } from "@app/components/dialogsOrDrawers/deleteTranslationContent"
import { TranslationForm } from "@app/components/forms/translationForm/translationForm"
import { Button } from "@app/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@app/components/ui/dropdown-menu"
import { useSidebar } from "@app/components/ui/sidebar"
import { SyntheticEvent, useState } from "react"
import { useTranslations } from "next-intl"
import * as React from "react"

import {
	DialogOrDrawer,
	DialogOrDrawerContent,
	DialogOrDrawerDescription,
	DialogOrDrawerHeader,
	DialogOrDrawerTitle,
} from "@app/components/ui/dialogOrDrawer"
import { useSuspenseQuery } from "@tanstack/react-query"
import {
	getCefrLevelsQueryOptions,
	getCollectionsQueryOptions,
	getUniversalPosTagsQueryOptions,
} from "@app/utils/reactQuery/queryOptions"

type TranslationActionsProps = {
	collectionId?: number
	translationId: number
	sourceText: string
	targetText: string
	cefrLevelId?: number
	universalPosTagIds: number[]
}

export const TranslationActions = ({
	collectionId,
	translationId,
	sourceText,
	targetText,
	cefrLevelId,
	universalPosTagIds,
}: TranslationActionsProps) => {
	// --- STATE ---

	const t = useTranslations()

	const {
		data: { data: collections },
	} = useSuspenseQuery(getCollectionsQueryOptions())

	const {
		data: { data: cefrLevels },
	} = useSuspenseQuery(getCefrLevelsQueryOptions())

	const {
		data: { data: universalPosTags },
	} = useSuspenseQuery(getUniversalPosTagsQueryOptions())

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
						<span className="sr-only">{t("components.translationActions.dropdownTrigger")}</span>

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
						<span>{t("components.translationActions.dropdownEditButton")}</span>
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DropdownMenuItem disabled={!collectionId} onClick={() => setIsDeleteFromCollectionDialogOpen(true)}>
						<Delete className="text-muted-foreground" />
						<span>{t("components.translationActions.dropdownDeleteFromCollectionButton")}</span>
					</DropdownMenuItem>

					<DropdownMenuItem onClick={() => setIsDeleteTranslationDialogOpen(true)}>
						<Trash2 className="text-muted-foreground" />
						<span>{t("components.translationActions.dropdownDeleteTranslationButton")}</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<DialogOrDrawer open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
				<DialogOrDrawerContent onClick={(e: SyntheticEvent) => e.stopPropagation()}>
					<DialogOrDrawerHeader>
						<DialogOrDrawerTitle>{t("forms.translationForm.title")}</DialogOrDrawerTitle>

						<DialogOrDrawerDescription>{t("forms.translationForm.description")}</DialogOrDrawerDescription>
					</DialogOrDrawerHeader>

					{isEditFormOpen && (
						<TranslationForm
							universalPosTags={universalPosTags}
							cefrLevels={cefrLevels}
							collections={collections}
							translationId={translationId}
							formType="update"
							defaultValues={{
								universalPosTagIds,
								sourceText,
								targetText,
								collectionId,
								cefrLevelId,
							}}
							onSubmit={() => setIsEditFormOpen(false)}
							onCancel={() => setIsEditFormOpen(false)}
						/>
					)}
				</DialogOrDrawerContent>
			</DialogOrDrawer>

			{collectionId && (
				<DialogOrDrawer open={isDeleteFromCollectionDialogOpen} onOpenChange={setIsDeleteFromCollectionDialogOpen}>
					<DeleteTranslationFromCollectionContent
						id={collectionId}
						translationId={translationId}
						handleIsDialogOpen={setIsDeleteFromCollectionDialogOpen}
					/>
				</DialogOrDrawer>
			)}

			<DialogOrDrawer open={isDeleteTranslationDialogOpen} onOpenChange={setIsDeleteTranslationDialogOpen}>
				<DeleteTranslationContent translationId={translationId} handleIsDialogOpen={setIsDeleteTranslationDialogOpen} />
			</DialogOrDrawer>
		</>
	)
}
