import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { $api } from "@app/utils/api/apiRequests"
import { getQueryClient } from "@app/utils/reactQuery/reactQueryHelpers"
import { getLocale, getLocaleFromPathname, getPage } from "@app/utils/routing/routingHelpers"

export const middleware = async (request: NextRequest) => {
	const { pathname } = request.nextUrl

	const locale = getLocaleFromPathname(request.nextUrl.pathname) || getLocale(request)

	const authCookie = request.cookies.get("auth-cookie")

	const queryClient = getQueryClient()

	const { response_object } = await queryClient.fetchQuery(
		$api.queryOptions("post", "/authenticate", {
			headers: authCookie?.value ? { Cookie: `auth-cookie=${authCookie?.value}` } : undefined,
		}),
	)

	const page = getPage(request.nextUrl.pathname, Boolean(response_object?.isAuthenticated))

	const validPathname = `/${locale}/${page}`

	const isPathnameValid = pathname === validPathname

	if (!isPathnameValid) {
		return NextResponse.redirect(new URL(validPathname, request.nextUrl))
	}

	return NextResponse.next()
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
