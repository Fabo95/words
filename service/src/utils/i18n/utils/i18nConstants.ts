// Replaces placeholders in a translation string with dynamic values passed in the interpolation object.
import { Locale } from "@app/utils/locale/localeTypes";
import GermanTranslation from "@app/utils/i18n/dictionaries/de.json";
import EnglishTranslation from "@app/utils/i18n/dictionaries/en.json";

export const TRANSLATION_STRING_PLACEHOLDER_PATTERN = /{(.*?)}/g;

export const LOCALE_TO_DICTIONARY_MAP = {
    [Locale.DE]: GermanTranslation,
    [Locale.EN]: EnglishTranslation,
};
