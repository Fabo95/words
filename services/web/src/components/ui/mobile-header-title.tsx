"use client"

import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"

// Map localized paths to translation keys
const pageTitleKeys: Record<string, string> = {
	// English paths
	"/home": "pages.home.title",
	"/translations": "pages.translations.title",
	"/learning": "pages.learning.title",
	"/account": "pages.account.title",
	// German paths
	"/startseite": "pages.home.title",
	"/uebersetzungen": "pages.translations.title",
	"/konto": "pages.account.title",
}

export function MobileHeaderTitle() {
	const pathname = usePathname()
	const t = useTranslations()

	// Remove locale prefix (e.g., /de/startseite -> /startseite)
	const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, "")

	// Find matching page title
	const titleKey = Object.entries(pageTitleKeys).find(([path]) =>
		pathWithoutLocale === path || pathWithoutLocale.startsWith(`${path}/`)
	)?.[1]

	if (!titleKey) return null

	return (
		<span className="md:hidden text-base font-semibold tracking-tight absolute left-1/2 -translate-x-1/2">
			{t(titleKey)}
		</span>
	)
}
