"use client"

import { Folder, Plus, Trash2 } from "lucide-react"

import { SidebarCollectionForm } from "@app/components/appSidebar/components/sidebarCollections/sidebarCollectionForm/sidebarCollectionForm"
import { Button } from "@app/components/ui/button"
import { Dialog, DialogTrigger } from "@app/components/ui/dialog"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
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
import { useClientTFunction } from "@app/utils/i18n/utils/i18nHooks"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { useState } from "react"

export function SidebarCollections() {
	// --- STATE ---

	const { isMobile } = useSidebar()

	const [isCollectionFormOpen, setIsCollectionFormOpen] = useState(false)

	const t = useClientTFunction()

	const {
		data: { response_object },
	} = $api.useSuspenseQuery("get", "/collection/all")

	// --- RENDER ---

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>{t("components.navCollections.title")}</SidebarGroupLabel>

			<Dialog open={isCollectionFormOpen} onOpenChange={setIsCollectionFormOpen}>
				<SidebarMenu>
					{response_object?.map((collection) => (
						<SidebarMenuItem key={collection.name}>
							<SidebarMenuButton asChild>
								<a href={collection.name}>
									<span>{collection.name}</span>
								</a>
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
									<DropdownMenuItem>
										<Folder className="text-muted-foreground" />
										<span>{t("components.navCollections.dropdownOpenButton")}</span>
									</DropdownMenuItem>
									<DropdownMenuItem>
										<Trash2 className="text-muted-foreground" />
										<span>{t("components.navCollections.dropdownDeleteButton")}</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</SidebarMenuItem>
					))}
					<SidebarMenuItem className="mt-3">
						<DialogTrigger asChild>
							<Button size="sm" variant="outline" className="w-full">
								<Plus className="w-5 mr-1" />
								<span>{t("components.navCollections.addCollectionButton")}</span>
							</Button>
						</DialogTrigger>
					</SidebarMenuItem>
				</SidebarMenu>

				<SidebarCollectionForm handleOpenChange={setIsCollectionFormOpen} />
			</Dialog>
		</SidebarGroup>
	)
}
