"use client"

import { Book, Frame, HomeIcon, Languages, Map, PieChart, User } from "lucide-react"
import * as React from "react"

import { LanguageSwitcher } from "@app/components/appSidebar/languageSwitcher"
import { NavCollections } from "@app/components/appSidebar/navCollections"
import { PageNavigation } from "@app/components/appSidebar/pageNavigation"
import { UserActions } from "@app/components/appSidebar/userActions"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@app/components/ui/sidebar"
import { useClientTFunction } from "@app/utils/i18n/utils/i18nHooks"
import { useMemo } from "react"

// This is sample data.
const data = {
	projects: [
		{
			name: "Design Engineering",
			url: "#",
			icon: Frame,
		},
		{
			name: "Sales & Marketing",
			url: "#",
			icon: PieChart,
		},
		{
			name: "Travel",
			url: "#",
			icon: Map,
		},
	],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	// --- STATE ---

	const t = useClientTFunction()

	// --- MEMOIZED DATA ---

	const pageItems = useMemo(() => {
		return [
			{
				title: t("pages.home.title"),
				url: "/home",
				icon: HomeIcon,
			},
			{
				title: t("pages.learning.title"),
				url: "/learning",
				icon: Book,
			},
			{
				title: t("pages.account.title"),
				url: "/account",
				icon: User,
			},
		]
	}, [t])

	// Fetch it later from db.
	const LANGUAGES = useMemo(
		() => [
			{
				name: t("components.languageSwitcher.dropdownOptionLabel"),
				logo: Languages,
				description: t("components.languageSwitcher.dropdownOptionDescription"),
			},
		],
		[t],
	)

	// --- RENDER ---

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<LanguageSwitcher languages={LANGUAGES} />
			</SidebarHeader>
			<SidebarContent>
				<PageNavigation title={t("components.pageNavigation.title")} items={pageItems} />
				<NavCollections collections={data.projects} />
			</SidebarContent>
			<SidebarFooter>
				<UserActions />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
