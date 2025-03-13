import { z } from "zod"

import { TFunction } from "@app/utils/i18n/utils/i18nTypes"

export const getCollectionFormSchema = (t: TFunction) =>
	z.object({
		name: z.string().min(1, { message: t("components.navCollections.form.nameError") }),
	})
