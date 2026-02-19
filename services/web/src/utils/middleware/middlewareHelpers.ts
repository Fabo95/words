import { LOGGED_IN_PATHNAME, LOGGED_OUT_PATHNAME, routing } from "@app/i18n/routing"
import { URLPattern } from "next/server"
import { Locale } from "@app/utils/locale/localeTypes"

function buildPatterns(paths: typeof LOGGED_IN_PATHNAME | typeof LOGGED_OUT_PATHNAME) {
	return paths.flatMap((path) => {
		// routing.pathnames[internal] is a Record<Locale, localizedPath>
		return (Object.entries(routing.pathnames[path]) as [Locale, string][]).map(
			([, localizedPath]) =>
				// prefix with /:lang so we match `/de/anmeldung` *or* `/en/authentication`
				new URLPattern({ pathname: `/:lang${localizedPath}` }),
		)
	})
}

export const LOGGED_OUT_URL_PATTERNS = buildPatterns(LOGGED_OUT_PATHNAME)

export const LOGGED_IN_URL_PATTERNS = buildPatterns(LOGGED_IN_PATHNAME)

export const URL_PATTERNS = [...LOGGED_OUT_URL_PATTERNS, ...LOGGED_IN_URL_PATTERNS]

export const getIsLoggedOutRoute = (url: string) => {
	return LOGGED_OUT_URL_PATTERNS.some((pattern) => {
		return pattern.test(url)
	})
}

export const getIsLoggedInRoute = (pathname: string) => {
	return LOGGED_IN_URL_PATTERNS.some((pattern) => pattern.test({ pathname }))
}

export const getIsValidRoute = (pathname: string) => {
	return URL_PATTERNS.some((pattern) => pattern.exec({ pathname }) !== null)
}
