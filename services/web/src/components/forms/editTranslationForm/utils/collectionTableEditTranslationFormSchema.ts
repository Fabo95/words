import { z } from "zod"
import { TFunction } from "@app/utils/types/tFunction"

export const getEditTranslationFormSchema = (t: TFunction) =>
	z.object({
		sourceText: z.string().min(2, { message: t("forms.editTranslationForm.wordError") }),
		targetText: z.string().min(2, { message: t("forms.editTranslationForm.translationError") }),
	})
