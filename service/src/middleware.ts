import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { getLocale, getLocaleFromPathname, isValidPathname } from "@app/utils/routing/routingHelpers"
import { Page } from "@app/utils/routing/routingTypes"

// Used to make the locale persistent between navigation.
// TODO We need a way to set the localState, when the user changes the languages through the UI.
let localeState: string

export const middleware = async (request: NextRequest) => {
	const { pathname } = request.nextUrl

	// Extract locale from the pathname, take it from the state or fallback to a default locale
	const locale = getLocaleFromPathname(pathname) ?? localeState ?? getLocale(request)

	// Check for the auth cookie
	const authCookie = request.cookies.get("auth-cookie")

	// If the user tries to access the authentication page with an auth cookie, redirect to home
	if (authCookie && pathname.includes(Page.AUTHENTICATION)) {
		return NextResponse.redirect(new URL(`/${locale}/${Page.HOME}`, request.nextUrl))
	}

	// If no auth cookie, redirect to the authentication page
	if (!authCookie && !pathname.includes(Page.AUTHENTICATION)) {
		return NextResponse.redirect(new URL(`/${locale}/${Page.AUTHENTICATION}`, request.nextUrl))
	}

	// If the pathname is valid, allow the request to proceed
	if (isValidPathname(pathname)) {
		localeState = pathname.split("/")[1] as string

		return NextResponse.next()
	}

	// If the pathname does not have a locale but is valid when the local is added, redirect to pathname with locale.
	if (pathname.split("/")[1] !== locale && isValidPathname(`/${locale}${pathname}`)) {
		return NextResponse.redirect(new URL(`/${locale}/${pathname}`, request.nextUrl))
	}

	// If the pathname is not valid, redirect to the home page
	return NextResponse.redirect(new URL(`/${locale}/home`, request.nextUrl))
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico, sitemap.xml, robots.txt (metadata files)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
	],
}
