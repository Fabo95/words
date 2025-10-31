import { z } from "zod"

import { getCollectionCreateFormSchema } from "@app/components/appSidebar/components/sidebarCollections/components/sidebarCollectionCreateForm/utils/collectionCreateFromSchema"

export type CollectionCreateFormState = z.infer<ReturnType<typeof getCollectionCreateFormSchema>>
