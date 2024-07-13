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
        return NextResponse.redirect(new URL(validPathname, request.url));
    }
};

export const config = {
    matcher: ["/", "/de", "/en", "/de/:path*", "/en/:path*"],
};
