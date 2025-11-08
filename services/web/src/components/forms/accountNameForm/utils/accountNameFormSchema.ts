import { z } from "zod"

import { TFunction } from "@app/utils/types/tFunction"

export const getAccountNameFormSchema = (t: TFunction) =>
	z.object({
		email: z
			.string()
			.email({ message: t("forms.accountNameForm.error.email") })
			.readonly(),
		name: z
			.string()
			.min(2, { message: t("forms.accountNameForm.error.name") })
			.optional(),
	})
