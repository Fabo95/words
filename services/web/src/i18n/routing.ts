// src/i18n/routes.ts
import { defineRouting } from "next-intl/routing"
import { Locale } from "@app/utils/locale/localeTypes"
import {
	CollectionTableQuery,
	CollectionTableQueryy,
} from "@app/app/[lang]/(loggedIn)/collection/[id]/_content/collection/utils/collectionTableQuery"

// 1 Your one source of truth: split by logged out and logged in paths (without locale prefix)
export const LOGGED_OUT_PATHNAME = ["/authentication"] as const
export const LOGGED_IN_PATHNAME = ["/home", "/account", "/collection/:id"] as const

// 2 Combined source of truth of all paths
export const PATHNAME = [...LOGGED_OUT_PATHNAME, ...LOGGED_IN_PATHNAME] as const
export type Pathname = (typeof PATHNAME)[number]

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
} satisfies Record<Pathname, Record<Locale, string>>

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

const ROUTE_CONFIG = {
	"/authentication": {
		getUrl: (params?: any) => "/auth/login",
	},
	"/home": {
		getUrl: (params?: any) => "/auth/login",
	},
	"/account": {
		getUrl: (params?: any) => "/auth/login",
	},
	"/collection/:id": {
		getUrl: (id: string, query?: CollectionTableQuery) => {
			const basePath = `/collection/${id}` as const

			if (!query) return basePath

			const searchParams = new URLSearchParams()

			if (query.search) searchParams.append(CollectionTableQueryy.search, query.search)

			if (query.page) searchParams.append(CollectionTableQueryy.page, String(query.page))

			const queryString = searchParams.toString()

			return queryString ? `${basePath}?${queryString}` : basePath
		},
	},
	// biome-ignore lint/suspicious/noExplicitAny: Only keys are relevant for the typing
} satisfies Record<Pathname, any>

export const route = <T extends Pathname>(pathname: T) => ROUTE_CONFIG[pathname]
