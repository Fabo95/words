import { z } from "zod"

import { getEditTranslationFormSchema } from "@app/components/forms/editTranslationForm/utils/collectionTableEditTranslationFormSchema"

export type EditTranslationFormState = z.infer<ReturnType<typeof getEditTranslationFormSchema>>
