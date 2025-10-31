import { z } from "zod"

import { getCollectionEditFormSchema } from "services/words/src/components/appSidebar/components/sidebarCollections/components/sidebarCollectionEditForm/utils/collectionEditFromSchema"

export type CollectionEditFormState = z.infer<ReturnType<typeof getCollectionEditFormSchema>>
