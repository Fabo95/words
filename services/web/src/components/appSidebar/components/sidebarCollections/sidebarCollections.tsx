"use client"

import { Edit, Folder, Plus, Trash2 } from "lucide-react"

import { SidebarCollectionCreateDialog } from "@app/components/appSidebar/components/sidebarCollections/components/sidebarCollectionCreateForm/sidebarCollectionCreateDialog"
import { SidebarCollectionDeleteDialog } from "@app/components/appSidebar/components/sidebarCollections/components/sidebarCollectionDeleteDialog/sidebarCollectionDeleteDialog"
import { SidebarCollectionEditDialog } from "@app/components/appSidebar/components/sidebarCollections/components/sidebarCollectionEditForm/sidebarCollectionEditDialog"
import { Button } from "@app/components/ui/button"
import { Dialog, DialogTrigger } from "@app/components/ui/dialog"
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
import { $api } from "@app/utils/api/apiRequests"
import { useTranslations } from "next-intl"
import { getCollectionPage } from "@app/utils/urls/urls"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function SidebarCollections() {
	// --- STATE ---

	const router = useRouter()

	const { isMobile } = useSidebar()

	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

	const t = useTranslations()

	const {
		data: { response_object: collections },
	} = $api.useSuspenseQuery("get", "/user/collections")

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

								<DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
									<Edit className="text-muted-foreground" />
									<span>{t("components.navCollections.dropdownEditButton")}</span>
								</DropdownMenuItem>

								<DropdownMenuSeparator />

								<DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
									<Trash2 className="text-muted-foreground" />
									<span>{t("components.navCollections.dropdownDeleteButton")}</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>

						<SidebarCollectionEditDialog
							name={collection.name}
							id={collection.id}
							isDialogOpen={isEditDialogOpen}
							setIsDialogOpen={setIsEditDialogOpen}
						/>

						<SidebarCollectionDeleteDialog
							isDialogOpen={isDeleteDialogOpen}
							id={collection.id}
							setIsDialogOpen={setIsDeleteDialogOpen}
						/>
					</SidebarMenuItem>
				))}

				<SidebarMenuItem className="mt-3">
					<Button onClick={() => setIsCreateDialogOpen(true)} size="sm" variant="outline" className="w-full">
						<Plus className="w-5 mr-1" />
						<span>{t("components.navCollections.addCollectionButton")}</span>
					</Button>
				</SidebarMenuItem>

				<SidebarCollectionCreateDialog setIsDialogOpen={setIsCreateDialogOpen} isDialogOpen={isCreateDialogOpen} />
			</SidebarMenu>
		</SidebarGroup>
	)
}
