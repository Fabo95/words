"use client"

import * as React from "react"
import { Skeleton } from "@app/components/ui/skeleton"
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem } from "@app/components/ui/sidebar"

type SidebarGroupFallbackProps = {
	/** How many menu rows to show */
	rows?: number
	/** Whether to show the "Add" button skeleton at the bottom */
	showButton?: boolean
}

export function SidebarGroupFallback({ rows = 5, showButton = true }: SidebarGroupFallbackProps) {
	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel className="pl-0 mb-2">
				<Skeleton className="h-3 w-[60%]" />
			</SidebarGroupLabel>

			<SidebarMenu className="gap-4">
				{Array.from({ length: rows }).map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<SidebarMenuItem key={i} className="flex items-center">
						<Skeleton className="h-4 w-[70%]" />
					</SidebarMenuItem>
				))}

				{showButton && (
					<SidebarMenuItem className="mt-3">
						<Skeleton className="h-9 w-full rounded-md" />
					</SidebarMenuItem>
				)}
			</SidebarMenu>
		</SidebarGroup>
	)
}
