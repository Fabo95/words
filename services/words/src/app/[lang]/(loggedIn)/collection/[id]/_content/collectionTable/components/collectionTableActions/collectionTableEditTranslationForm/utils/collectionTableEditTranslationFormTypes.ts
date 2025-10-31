import { z } from "zod"

import { getEditTranslationFormSchema } from "@app/app/[lang]/(loggedIn)/collection/[id]/_content/collectionTable/components/collectionTableActions/collectionTableEditTranslationForm/utils/collectionTableEditTranslationFormSchema"

export type EditTranslationFormState = z.infer<ReturnType<typeof getEditTranslationFormSchema>>
