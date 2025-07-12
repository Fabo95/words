import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"
import { NextRequest, NextResponse } from "next/server"
import { Cookies } from "@app/utils/cookies/cookies"
import { getIsLoggedInRoute, getIsLoggedOutRoute } from "@app/utils/middleware/middlewareHelpers"
import { ENV } from "@app/utils/env/env"

const i18nMiddleware = createMiddleware(routing)

// See: https://next-intl.dev/docs/routing/middleware#composing-other-middlewares
export default async function middleware(request: NextRequest) {
	const response = i18nMiddleware(request)

	if (response && !response.ok) {
		// response not in the range 200-299 (usually a redirect)
		// no need to execute the auth middleware
		return response
	}
	return await authMiddleware(request, response)
}

async function authMiddleware(request: NextRequest, response: NextResponse) {
	const { pathname, origin } = request.nextUrl

	const accessToken = request.cookies.get(Cookies.ACCESS_TOKEN)

	const routeUrl = `${origin}${pathname}`

	// Public routes that don't require authentication
	const isLoggedOutRoute = getIsLoggedOutRoute(routeUrl)

	if (!accessToken) {
		if (isLoggedOutRoute) {
			return response
		}

		return NextResponse.redirect(`${ENV.NEXT_PUBLIC_DEPLOYMENT_URL}/authentication`)
	}

	try {
		// PARSE ACCESS TOKEN
		const isLoggedInRoute = getIsLoggedInRoute(routeUrl)

		if (isLoggedInRoute) {
			return response
		}

		return NextResponse.redirect(`${ENV.NEXT_PUBLIC_DEPLOYMENT_URL}/home`)
	} catch (_error) {
		const response = NextResponse.redirect(`${ENV.NEXT_PUBLIC_DEPLOYMENT_URL}/authentication`)

		response.cookies.delete(Cookies.ACCESS_TOKEN)

		return response
	}
}

export const config = {
	// Match all pathnames except for
	// - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
	// - … the ones containing a dot (e.g. `favicon.ico`)
	matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
}
