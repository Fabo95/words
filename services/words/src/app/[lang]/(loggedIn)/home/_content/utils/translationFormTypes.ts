import { z } from "zod"

import { getTranslationFormSchema } from "services/words/src/app/[lang]/(loggedIn)/home/_content/utils/translationFormSchema"

export type TranslationFormState = z.infer<ReturnType<typeof getTranslationFormSchema>>
