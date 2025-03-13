import { z } from "zod"

import { getCollectionFormSchema } from "@app/components/appSidebar/components/sidebarCollections/components/sidebarCollectionCreateForm/utils/collectionFromSchema"

export type CollectionFormState = z.infer<ReturnType<typeof getCollectionFormSchema>>
