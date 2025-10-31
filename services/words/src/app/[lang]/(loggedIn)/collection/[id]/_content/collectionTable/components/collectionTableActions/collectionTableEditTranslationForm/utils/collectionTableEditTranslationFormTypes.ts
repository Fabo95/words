import { z } from "zod"

import { getEditTranslationFormSchema } from "services/words/src/app/[lang]/(loggedIn)/collection/[id]/_content/collectionTable/components/collectionTableActions/collectionTableEditTranslationForm/utils/collectionTableEditTranslationFormSchema"

export type EditTranslationFormState = z.infer<ReturnType<typeof getEditTranslationFormSchema>>
