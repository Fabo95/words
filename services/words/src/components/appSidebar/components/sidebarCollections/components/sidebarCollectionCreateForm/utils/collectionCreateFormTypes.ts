import { z } from "zod"

import { getCollectionCreateFormSchema } from "services/words/src/components/appSidebar/components/sidebarCollections/components/sidebarCollectionCreateForm/utils/collectionCreateFromSchema"

export type CollectionCreateFormState = z.infer<ReturnType<typeof getCollectionCreateFormSchema>>
