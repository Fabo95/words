import GermanTranslation from "@app/utils/i18n/dictionaries/de.json";
import EnglishTranslation from "@app/utils/i18n/dictionaries/en.json";
import { Locale } from "@app/utils/locale/localeTypes";
import { Dictionary, TFunction } from "@app/utils/i18n/utils/i18nTypes";
import { getNestedObjectValue } from "@app/utils/i18n/utils/i18nHelpers";
import { TRANSLATION_STRING_PLACEHOLDER_PATTERN } from "@app/utils/i18n/utils/i18nConstants";

const LOCALE_TO_DICTIONARY_MAP = {
    [Locale.DE]: GermanTranslation,
    [Locale.EN]: EnglishTranslation,
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
