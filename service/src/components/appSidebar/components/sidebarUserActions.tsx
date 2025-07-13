"use client"

import { LogOut, Sparkles, User } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@app/components/ui/avatar"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@app/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@app/components/ui/sidebar"
import { $api } from "@app/utils/api/apiRequests"
import { useClientTFunction } from "@app/utils/i18n/utils/i18nHooks"
import { Page } from "@app/utils/types/pageTypes"
import { CaretSortIcon } from "@radix-ui/react-icons"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useCallback } from "react"

export function SidebarUserActions() {
	// --- STATE ---

	const { isMobile } = useSidebar()

	const t = useClientTFunction()

	const queryClient = useQueryClient()

	const router = useRouter()

	const {
		data: { response_object },
	} = $api.useSuspenseQuery("get", "/user")

	const { mutateAsync: mutateUserLogout } = $api.useMutation("post", "/user/logout", {
		onSuccess: () => {
			router.push(`/${Page.AUTHENTICATION}`)
			queryClient.invalidateQueries()
		},
	})

	// --- CALLBACKS ---

	const handleToAccountClick = useCallback(() => {
		router.push(`/${Page.ACCOUNT}`)
	}, [router])

	// --- RENDER ---

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage src="/avatars/shadcn.jpg" alt={response_object?.name ?? "Avatar"} />
								<AvatarFallback className="rounded-lg">CN</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">{response_object?.name ?? "-"}</span>
								<span className="truncate text-xs">{response_object?.email ?? "-"}</span>
							</div>
							<CaretSortIcon className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage src="/avatars/shadcn.jpg" alt={response_object?.name ?? "Avatar"} />
									<AvatarFallback className="rounded-lg">CN</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">{response_object?.name ?? "-"}</span>
									<span className="truncate text-xs">{response_object?.email ?? "-"}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<Sparkles />
								Upgrade to Pro
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem onClick={handleToAccountClick}>
								<User />
								{t("components.userActions.account")}
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => mutateUserLogout({})}>
							<LogOut />
							{t("components.userActions.logout")}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
