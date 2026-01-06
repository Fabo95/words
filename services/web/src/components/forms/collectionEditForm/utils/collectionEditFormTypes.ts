import { z } from "zod"

import { getCollectionEditFormSchema } from "@app/components/forms/collectionEditForm/utils/collectionEditFromSchema"

export type CollectionEditFormState = z.infer<ReturnType<typeof getCollectionEditFormSchema>>
