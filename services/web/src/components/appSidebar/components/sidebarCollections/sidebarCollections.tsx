"use client"

import { Edit, Folder, Trash2 } from "lucide-react"

import { CreateCollectionDialogOrDrawler } from "@app/components/dialogsOrDrawers/createCollectionDialogOrDrawler"
import { DeleteCollectionDialogOrDrawler } from "@app/components/dialogsOrDrawers/deleteCollectionDialogOrDrawler"
import { EditCollectionDialogOrDrawler } from "@app/components/dialogsOrDrawers/editCollectionDialogOrDrawler"
import { Button } from "@app/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@app/components/ui/dropdown-menu"
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@app/components/ui/sidebar"
import { useTranslations } from "next-intl"
import { getCollectionPage } from "@app/utils/urls/urls"
import { DotsHorizontalIcon, PlusIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { getCollectionsQueryOptions } from "@app/utils/reactQuery/queryOptions"
import { useSuspenseQuery } from "@tanstack/react-query"

export function SidebarCollections() {
	// --- STATE ---

	const router = useRouter()

	const { isMobile } = useSidebar()

	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
	const [deleteCollectionId, setDeleteCollectionId] = useState<number>()
	const [editCollectionId, setEditCollectionId] = useState<number>()

	const t = useTranslations()

	const {
		data: { data: collections },
	} = useSuspenseQuery(getCollectionsQueryOptions())

	// --- RENDER ---

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>{t("components.navCollections.title")}</SidebarGroupLabel>

			<SidebarMenu>
				{collections?.map((collection) => (
					<SidebarMenuItem key={collection.id}>
						<SidebarMenuButton asChild>
							<Link href={getCollectionPage(collection.id)}>
								<span>{collection.name}</span>
							</Link>
						</SidebarMenuButton>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuAction showOnHover>
									<DotsHorizontalIcon />
									<span className="sr-only">{t("components.navCollections.dropdownTrigger")}</span>
								</SidebarMenuAction>
							</DropdownMenuTrigger>

							<DropdownMenuContent
								className="w-48 rounded-lg"
								side={isMobile ? "bottom" : "right"}
								align={isMobile ? "end" : "start"}
							>
								<DropdownMenuItem onClick={() => router.push(getCollectionPage(collection.id))}>
									<Folder className="text-muted-foreground" />
									<span>{t("components.navCollections.dropdownOpenButton")}</span>
								</DropdownMenuItem>

								<DropdownMenuItem onClick={() => setEditCollectionId(collection.id)}>
									<Edit className="text-muted-foreground" />
									<span>{t("components.navCollections.dropdownEditButton")}</span>
								</DropdownMenuItem>

								<DropdownMenuSeparator />

								<DropdownMenuItem onClick={() => setDeleteCollectionId(collection.id)}>
									<Trash2 className="text-muted-foreground" />
									<span>{t("components.navCollections.dropdownDeleteButton")}</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>

						<EditCollectionDialogOrDrawler
							name={collection.name}
							id={collection.id}
							isDialogOpen={collection.id === editCollectionId}
							setIsDialogOpen={(isOpen) => setEditCollectionId(isOpen ? editCollectionId : undefined)}
						/>

						<DeleteCollectionDialogOrDrawler
							id={collection.id}
							isDialogOpen={collection.id === deleteCollectionId}
							setIsDialogOpen={(isOpen) => setDeleteCollectionId(isOpen ? deleteCollectionId : undefined)}
						/>
					</SidebarMenuItem>
				))}

				<SidebarMenuItem className="mt-3">
					<Button onClick={() => setIsCreateDialogOpen(true)} size="sm" variant="outline" className="w-full">
						<PlusIcon className="w-5 mr-1" />

						<span>{t("components.navCollections.addCollectionButton")}</span>
					</Button>
				</SidebarMenuItem>

				<CreateCollectionDialogOrDrawler setIsDialogOpen={setIsCreateDialogOpen} isDialogOpen={isCreateDialogOpen} />
			</SidebarMenu>
		</SidebarGroup>
	)
}
