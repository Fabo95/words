import { z } from "zod"

import { getTranslationFormSchema } from "@app/components/forms/createTranslationForm/utils/translationFormSchema"

export type TranslationFormState = z.infer<ReturnType<typeof getTranslationFormSchema>>
