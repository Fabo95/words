import { TFunction } from "@app/utils/types/tFunction"

export enum Locale {
	DE_DE = "de-DE",
	EN_GB = "en-GB",
}

export const getLanguageOptions = (t: TFunction) => [
	{ value: Locale.EN_GB, label: t("common.language.english") },
	{ value: Locale.DE_DE, label: t("common.language.german") },
]
