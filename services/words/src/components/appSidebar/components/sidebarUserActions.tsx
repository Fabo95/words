"use client"

import { LogOut, Sparkles, User } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "services/words/src/components/ui/avatar"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "services/words/src/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "services/words/src/components/ui/sidebar"
import { $api } from "services/words/src/utils/api/apiRequests"
import { useTranslations } from "next-intl"
import { Page } from "services/words/src/utils/types/pageTypes"
import { CaretSortIcon } from "@radix-ui/react-icons"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useCallback } from "react"

export function SidebarUserActions() {
	// --- STATE ---

	const { isMobile } = useSidebar()

	const t = useTranslations()

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
