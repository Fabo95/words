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
import { useTranslations } from "next-intl"
import { Page } from "@app/utils/types/pageTypes"
import { CaretSortIcon } from "@radix-ui/react-icons"
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useCallback } from "react"
import { getUserQueryOptions } from "@app/utils/reactQuery/queryOptions"

export function SidebarUserActions() {
	// --- STATE ---

	const { isMobile } = useSidebar()

	const t = useTranslations()

	const queryClient = useQueryClient()

	const router = useRouter()

	const {
		data: { data },
	} = useSuspenseQuery(getUserQueryOptions())

	const { mutateAsync: mutateUserLogout } = $api.useMutation("post", "/user/logout", {
		onSuccess: async () => {
			router.push(`/${Page.AUTHENTICATION}`)
			await queryClient.invalidateQueries()
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
								<AvatarFallback className="rounded-lg">
									{data?.name
										?.split(" ")
										.map((n) => n[0])
										.join("")
										.toUpperCase()
										.slice(0, 2) ?? "?"}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">{data?.name ?? "-"}</span>
								<span className="truncate text-xs">{data?.email ?? "-"}</span>
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
									<AvatarFallback className="rounded-lg">
										{data?.name
											?.split(" ")
											.map((n) => n[0])
											.join("")
											.toUpperCase()
											.slice(0, 2) ?? "?"}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">{data?.name ?? "-"}</span>
									<span className="truncate text-xs">{data?.email ?? "-"}</span>
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
