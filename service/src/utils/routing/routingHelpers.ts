import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextRequest } from "next/server";
import { ReadonlyURLSearchParams } from "next/dist/client/components/navigation";

import { Page } from "@app/utils/routing/routingTypes";
import { Locale } from "@app/utils/locale/localeTypes";
import { LOGGED_IN_PAGES } from "@app/utils/routing/routingConstants";

export const getLocaleFromPathname = (pathname: NextRequest["nextUrl"]["pathname"]) => {
    const locale = Object.values(Locale).find((currentLocale) => pathname.includes(currentLocale));

    if (!locale) {
        return undefined;
    }

    return locale;
};

export const getPage = (pathname: NextRequest["nextUrl"]["pathname"], isAuthenticated: boolean) => {
    // We use the below code as soon user _content is implemented.
    if (isAuthenticated) {
        const loggedInPage = LOGGED_IN_PAGES.find((currentPage) => pathname.includes(currentPage));

        return loggedInPage || Page.HOME;
    }

    return Page.AUTHENTICATION;
};

export const getLocale = (request: NextRequest): string | undefined => {
    // Negotiator expects plain object so we need to transform headers
    const negotiatorHeaders: Record<string, string> = {};
    const locales = Object.values(Locale);

    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

    // Use negotiator and intl-localematcher to get best locale
    const languages = new Negotiator({
        headers: negotiatorHeaders,
    }).languages();

    return matchLocale(languages, locales as string[], Locale.EN);
};

export const createSearchParams = (
    keyValuePairs: Record<string, string | boolean | number>,
    searchParams?: ReadonlyURLSearchParams
) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(keyValuePairs).forEach(([key, value]) => {
        if (params.has(key)) {
            params.delete(key);
        }

        params.set(key, String(value));
    });

    return params.toString();
};

export const deleteSearchParams = ({
    keysToDelete,
    searchParams,
}: {
    keysToDelete: string[];
    searchParams: ReadonlyURLSearchParams;
}) => {
    const params = new URLSearchParams(searchParams);

    keysToDelete.forEach((key) => {
        params.delete(key);
    });

    return params.toString();
};
