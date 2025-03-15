import { z } from "zod"

import { TFunction } from "@app/utils/i18n/utils/i18nTypes"

export const getEditTranslationFormSchema = (t: TFunction) =>
	z.object({
		sourceText: z.string().min(2, { message: t("pages.collection.table.editTranslationForm.wordError") }),
		targetText: z.string().min(2, { message: t("pages.account.name.error.translationError") }),
	})
