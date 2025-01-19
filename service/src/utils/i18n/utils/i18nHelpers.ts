import { Dictionary, RecursiveObjectType, TFunction } from "@app/utils/i18n/utils/i18nTypes";
import { Locale } from "@app/utils/locale/localeTypes";
import { LOCALE_TO_DICTIONARY_MAP, TRANSLATION_STRING_PLACEHOLDER_PATTERN } from "@app/utils/i18n/utils/i18nConstants";

/**
 * Takes a nested object and an array of keys and returns the corresponding nested string value.
 */
export const getNestedObjectValue = (obj: RecursiveObjectType | string, keys: string[]): string => {
    const [first, ...rest] = keys;

    if (typeof obj === "string") {
        return obj;
    }

    if (typeof obj === "object" && obj[first]) {
        return getNestedObjectValue(obj[first], rest);
    }

    return "wrong key";
};

export const getTFunction = (locale: Locale): TFunction => {
    const dictionary: Dictionary = LOCALE_TO_DICTIONARY_MAP[locale];

    return (translationKey, interpolation) => {
        const properties = translationKey.split(".");

        const translation = getNestedObjectValue(dictionary, properties);

        if (!interpolation) {
            return translation;
        }

        return translation.replace(TRANSLATION_STRING_PLACEHOLDER_PATTERN, (match, key) => String(interpolation[key]));
    };
};
