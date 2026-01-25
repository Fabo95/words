import { z } from "zod"
import { TFunction } from "@app/utils/types/tFunction"

export const getAccountPasswordFormSchema = (t: TFunction) =>
	z
		.object({
			password: z
				.string()
				.min(8, { message: t("forms.accountPasswordForm.error.password") })
				.optional(),
			confirmPassword: z
				.string()
				.min(8, { message: t("forms.accountPasswordForm.error.password") })
				.optional(),
		})
		.refine((data) => (!data.password && !data.confirmPassword) || data.password === data.confirmPassword, {
			message: t("forms.accountPasswordForm.error.passwordsDoNotMatch"),
			path: ["confirmPassword"],
		})
