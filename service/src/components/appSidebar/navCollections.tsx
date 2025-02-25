"use client"

import { Folder, type LucideIcon, Plus, Trash2 } from "lucide-react"

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
import { $api } from "@app/utils/api/apiRequests"
import { useClientTFunction } from "@app/utils/i18n/utils/i18nHooks"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"

type NavCollectionsProps = {
	collections: {
		name: string
		url: string
		icon: LucideIcon
	}[]
}

export function NavCollections({ collections }: NavCollectionsProps) {
	// --- STATE ---

	const { isMobile } = useSidebar()

	const t = useClientTFunction()

	const {
		data: { response_object },
	} = $api.useSuspenseQuery("get", "/collection/all")

	console.log("response_object", response_object)
	// --- RENDER ---

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>{t("components.navCollections.title")}</SidebarGroupLabel>
			<SidebarMenu>
				{collections.map((collection) => (
					<SidebarMenuItem key={collection.name}>
						<SidebarMenuButton asChild>
							<a href={collection.url}>
								<collection.icon />
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
					<Button size="sm" variant="outline" className="w-full">
						<Plus className="w-5 mr-1" />
						<span>{t("components.navCollections.addCollectionButton")}</span>
					</Button>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarGroup>
	)
}
