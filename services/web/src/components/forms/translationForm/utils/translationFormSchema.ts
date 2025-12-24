import { z } from "zod"
import { TFunction } from "@app/utils/types/tFunction"

export const getTranslationFormSchema = (t: TFunction) =>
	z.object({
		sourceText: z.string().min(2, { message: t("forms.translationForm.wordError") }),
		targetText: z.string().min(2, { message: t("forms.translationForm.translationError") }),
		collectionId: z.number({ message: t("forms.translationForm.collectionError") }).optional(),
		cefrLevelId: z.number({ message: t("forms.translationForm.collectionError") }).optional(),
	})
