import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getLocale, getLocaleFromPathname, getPage } from "@app/lib/routing/routingHelpers";

export const middleware = async (request: NextRequest) => {
    const { pathname } = request.nextUrl;

    const locale = getLocaleFromPathname(request.nextUrl.pathname) || getLocale(request);

    const page = getPage(request.nextUrl.pathname);

    const validPathname = `/${locale}/${page}`;

    const isPathnameValid = pathname === validPathname;

    if (!isPathnameValid) {
        return NextResponse.redirect(new URL(validPathname, request.nextUrl));
    }

    return NextResponse.next();
};

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        `/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)`,
    ],
};
