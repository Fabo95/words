import { z } from "zod"

import { getTranslationFormSchema } from "@app/components/forms/translationForm/utils/translationFormSchema"

export type TranslationFormState = z.infer<ReturnType<typeof getTranslationFormSchema>>
