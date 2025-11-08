import { z } from "zod"

export const getTranslationFormSchema = (t: TFunction) =>
	z.object({
		sourceLanguage: z.string().min(1, { message: t("forms.createTranslationForm.wordError") }),
		targetLanguage: z.string().min(1, { message: t("forms.createTranslationForm.translationError") }),
		sourceText: z.string().min(1, { message: t("forms.createTranslationForm.wordError") }),
		targetText: z.string().min(1, { message: t("forms.createTranslationForm.wordError") }),
		collectionId: z.number({ message: t("forms.createTranslationForm.collectionError") }).optional(),
	})
