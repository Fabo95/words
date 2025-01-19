"use client";

import { TFunction } from "@app/utils/i18n/utils/i18nTypes";
import { useParams } from "next/navigation";
import { Locale } from "@app/utils/locale/localeTypes";
import { getTFunction } from "@app/utils/i18n/utils/i18nHelpers";

export const useClientTFunction = (): TFunction => {
    // --- STATE ---

    const { lang } = useParams<Record<"lang", Locale>>();

    // --- RETURN ---

    return getTFunction(lang);
};
