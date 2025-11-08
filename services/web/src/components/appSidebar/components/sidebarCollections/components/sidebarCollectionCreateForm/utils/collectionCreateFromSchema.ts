import { z } from "zod"

import { TFunction } from "@app/utils/types/tFunction"

export const getCollectionCreateFormSchema = (t: TFunction) =>
	z.object({
		name: z.string().min(1, { message: t("components.navCollections.createForm.nameError") }),
	})
