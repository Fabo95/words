"use client"

import { type LucideIcon } from "lucide-react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@app/components/ui/collapsible"
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@app/components/ui/sidebar"
import { ChevronRightIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function SidebarNavigation({
	title,
	items,
}: {
	title: string
	items: {
		title: string
		url: string
		icon?: LucideIcon
		subitems?: {
			title: string
			url: string
		}[]
	}[]
}) {
	const pathname = usePathname()

	const isItemActive = (url: string) => {
		// Remove locale prefix (e.g., /de-DE/home -> /home)
		const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, "")
		return pathWithoutLocale === url || pathWithoutLocale.startsWith(`${url}/`)
	}

	return (
		<SidebarGroup>
			<SidebarGroupLabel>{title}</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => {
					const isActive = isItemActive(item.url)
					return (
						<Collapsible key={item.title} asChild defaultOpen={isActive} className="group/collapsible">
							<SidebarMenuItem>
								{item.subitems ? (
									<>
										<CollapsibleTrigger asChild>
											<SidebarMenuButton tooltip={item.title} isActive={isActive}>
												{item.icon && <item.icon />}
												<span>{item.title}</span>
												<ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
											</SidebarMenuButton>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<SidebarMenuSub>
												{item.subitems.map((subItem) => (
													<SidebarMenuSubItem key={subItem.title}>
														<SidebarMenuSubButton asChild isActive={isItemActive(subItem.url)}>
															<Link href={subItem.url}>
																<span>{subItem.title}</span>
															</Link>
														</SidebarMenuSubButton>
													</SidebarMenuSubItem>
												))}
											</SidebarMenuSub>
										</CollapsibleContent>
									</>
								) : (
									<SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
										<Link href={item.url}>
											{item.icon && <item.icon />}
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								)}
							</SidebarMenuItem>
						</Collapsible>
					)
				})}
			</SidebarMenu>
		</SidebarGroup>
	)
}
