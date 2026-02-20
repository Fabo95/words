"use client"

import { Book, Home, Languages, User } from "lucide-react"
import { Link, usePathname } from "@app/i18n/navigation"
import { cn } from "@app/utils/shadcn/shadcnHelpers"
import { useTranslations } from "next-intl"

const navItems = [
	{ href: "/home", icon: Home, labelKey: "pages.home.title" },
	{ href: "/translations", icon: Languages, labelKey: "pages.translations.title" },
	{ href: "/learning", icon: Book, labelKey: "pages.learning.title" },
	{ href: "/account", icon: User, labelKey: "pages.account.title" },
] as const

export function BottomNavigation() {
	const pathname = usePathname()
	const t = useTranslations()

	const isActive = (href: string) => {
		return pathname === href || pathname.startsWith(`${href}/`)
	}

	return (
		<nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/80">
			<div className="flex items-center justify-around h-16 px-2 pb-safe">
				{navItems.map(({ href, icon: Icon, labelKey }) => {
					const active = isActive(href)
					return (
						<Link
							key={href}
							href={href}
							className={cn(
								"flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[64px]",
								active ? "text-primary" : "text-muted-foreground hover:text-foreground active:scale-95",
							)}
						>
							<div
								className={cn(
									"flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200",
									active && "bg-primary/15",
								)}
							>
								<Icon
									className={cn("h-5 w-5 transition-all duration-200", active && "scale-110")}
									strokeWidth={active ? 2.5 : 2}
								/>
							</div>
							<span className={cn("text-xs font-medium transition-all duration-200", active && "font-semibold")}>
								{t(labelKey)}
							</span>
						</Link>
					)
				})}
			</div>
		</nav>
	)
}
