import { z } from "zod"

import { getCollectionCreateFormSchema } from "@app/components/forms/collectionCreateForm/utils/collectionCreateFromSchema"

export type CollectionCreateFormState = z.infer<ReturnType<typeof getCollectionCreateFormSchema>>
