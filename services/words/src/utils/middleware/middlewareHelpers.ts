import { LOGGED_IN_PATHS, LOGGED_OUT_PATHS, routing } from "services/words/src/i18n/routing"
import { URLPattern } from "next/server"
import { Locale } from "services/words/src/utils/locale/localeTypes"
import { ENV } from "services/words/src/utils/env/env"

function buildPatterns(paths: typeof LOGGED_IN_PATHS | typeof LOGGED_OUT_PATHS) {
	return paths.flatMap((path) => {
		// routing.pathnames[internal] is a Record<Locale, localizedPath>
		return (Object.entries(routing.pathnames[path]) as [Locale, string][]).map(
			([, localizedPath]) =>
				// prefix with /:lang so we match `/de/anmeldung` *or* `/en/authentication`
				new URLPattern({ pathname: `/:lang${localizedPath}`, baseURL: ENV.NEXT_PUBLIC_DEPLOYMENT_URL }),
		)
	})
}

export const LOGGED_OUT_URL_PATTERNS = buildPatterns(LOGGED_OUT_PATHS)

export const LOGGED_IN_URL_PATTERNS = buildPatterns(LOGGED_IN_PATHS)

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
