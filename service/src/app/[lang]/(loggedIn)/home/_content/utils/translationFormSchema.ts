import { z } from "zod"

export const getTranslationFormSchema = (t: TFunction) =>
	z.object({
		sourceLanguage: z.string().min(1, { message: t("pages.home.createTranslationForm.wordError") }),
		targetLanguage: z.string().min(1, { message: t("pages.home.createTranslationForm.translationError") }),
		sourceText: z.string().min(1, { message: t("pages.home.createTranslationForm.wordError") }),
		targetText: z.string().min(1, { message: t("pages.home.createTranslationForm.wordError") }),
		collectionId: z.number({ message: t("pages.home.createTranslationForm.collectionError") }).optional(),
	})
