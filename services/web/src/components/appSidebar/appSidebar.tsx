"use client"

import { Book, HomeIcon, Languages, ListIcon, User } from "lucide-react"
import * as React from "react"

import { SidebarCollections } from "@app/components/appSidebar/components/sidebarCollections/sidebarCollections"
import { SidebarLanguageSwitch } from "@app/components/appSidebar/components/sidebarLanguageSwitch"
import { SidebarNavigation } from "@app/components/appSidebar/components/sidebarNavigation"
import { SidebarUserActions } from "@app/components/appSidebar/components/sidebarUserActions"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@app/components/ui/sidebar"
import { useTranslations } from "next-intl"
import { Suspense, useMemo } from "react"
import { SidebarGroupFallback } from "@app/components/appSidebar/components/sidebarGroupFallback"
import { Skeleton } from "@app/components/ui/skeleton"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	// --- STATE ---

	const t = useTranslations()

	// --- MEMOIZED DATA ---

	const pageItems = useMemo(() => {
		return [
			{
				title: t("pages.home.title"),
				url: "/home",
				icon: HomeIcon,
			},
			{
				title: t("pages.translations.title"),
				url: "/translations",
				icon: ListIcon,
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
				<SidebarLanguageSwitch languages={LANGUAGES} />
			</SidebarHeader>
			<SidebarContent>
				<Suspense fallback={<SidebarGroupFallback rows={3} showButton={false} />}>
					<SidebarNavigation title={t("components.pageNavigation.title")} items={pageItems} />
				</Suspense>

				<Suspense fallback={<SidebarGroupFallback rows={2} />}>
					<SidebarCollections />
				</Suspense>
			</SidebarContent>
			<SidebarFooter>
				<Suspense fallback={<Skeleton className="h-12" />}>
					<SidebarUserActions />
				</Suspense>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
