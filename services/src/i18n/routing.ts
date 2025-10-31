// src/i18n/routes.ts
import { defineRouting } from "next-intl/routing"
import { Locale } from "@app/utils/locale/localeTypes"

// 1 Your one source of truth: split by logged out and logged in paths (without locale prefix)

export const LOGGED_OUT_PATHS = ["/authentication"] as const

export const LOGGED_IN_PATHS = ["/home", "/account", "/collection/:id"] as const

// 2 Combined source of truth of all paths
export const PATHS = [...LOGGED_OUT_PATHS, ...LOGGED_IN_PATHS] as const

// 3 Use the same string keys to build your localized config
export const LOCALIZED_PATHNAME_CONFIG = {
	"/authentication": {
		[Locale.DE_DE]: "/anmeldung",
		[Locale.EN_GB]: "/authentication",
	},
	"/home": {
		[Locale.DE_DE]: "/startseite",
		[Locale.EN_GB]: "/home",
	},
	"/account": {
		[Locale.DE_DE]: "/konto",
		[Locale.EN_GB]: "/account",
	},
	"/collection/:id": {
		[Locale.DE_DE]: "/sammlung/:id",
		[Locale.EN_GB]: "/collection/:id",
	},
} satisfies Record<(typeof PATHS)[number], Record<Locale, string>>

// 4 Finally feed that into Next‑Intl
export const routing = defineRouting({
	locales: [Locale.DE_DE, Locale.EN_GB],
	defaultLocale: Locale.EN_GB,
	localePrefix: {
		mode: "always",
		prefixes: {
			[Locale.EN_GB]: "/en",
			[Locale.DE_DE]: "/de",
		},
	},
	pathnames: LOCALIZED_PATHNAME_CONFIG,
})
