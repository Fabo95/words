"use client"

import { Edit, Folder, Plus, Trash2 } from "lucide-react"

import { SidebarCollectionCreateForm } from "@app/components/appSidebar/components/sidebarCollections/components/sidebarCollectionCreateForm/sidebarCollectionCreateForm"
import { SidebarCollectionDeleteDialog } from "@app/components/appSidebar/components/sidebarCollections/components/sidebarCollectionDeleteDialog/sidebarCollectionDeleteDialog"
import { SidebarCollectionEditForm } from "@app/components/appSidebar/components/sidebarCollections/components/sidebarCollectionEditForm/sidebarCollectionEditForm"
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

	const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const [isEditFormOpen, setIsEditFormOpen] = useState(false)

	const t = useTranslations()

	const {
		data: { response_object },
	} = $api.useSuspenseQuery("get", "/user/collections")

	// --- RENDER ---

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>{t("components.navCollections.title")}</SidebarGroupLabel>

			<SidebarMenu>
				{response_object?.map((collection) => (
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

								<DropdownMenuItem onClick={() => setIsEditFormOpen(true)}>
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

						<Dialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
							{isEditFormOpen && (
								<SidebarCollectionEditForm
									name={collection.name}
									id={collection.id}
									handleIsDialogOpen={setIsEditFormOpen}
								/>
							)}
						</Dialog>

						<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
							<SidebarCollectionDeleteDialog id={collection.id} handleIsDialogOpen={setIsDeleteDialogOpen} />
						</Dialog>
					</SidebarMenuItem>
				))}

				<Dialog open={isCreateFormOpen} onOpenChange={setIsCreateFormOpen}>
					<SidebarMenuItem className="mt-3">
						<DialogTrigger asChild>
							<Button size="sm" variant="outline" className="w-full">
								<Plus className="w-5 mr-1" />
								<span>{t("components.navCollections.addCollectionButton")}</span>
							</Button>
						</DialogTrigger>
					</SidebarMenuItem>

					<SidebarCollectionCreateForm handleIsDialogOpen={setIsCreateFormOpen} />
				</Dialog>
			</SidebarMenu>
		</SidebarGroup>
	)
}
