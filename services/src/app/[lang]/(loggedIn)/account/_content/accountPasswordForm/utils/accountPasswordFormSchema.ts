import { z } from "zod"

export const getAccountPasswordFormSchema = (t: TFunction) =>
	z
		.object({
			password: z
				.string()
				.min(8, { message: t("pages.account.password.error.password") })
				.optional(),
			confirmPassword: z
				.string()
				.min(8, { message: t("pages.account.password.error.password") })
				.optional(),
		})
		.refine((data) => (!data.password && !data.confirmPassword) || data.password === data.confirmPassword, {
			message: t("pages.account.password.error.passwordsDoNotMatch"),
			path: ["confirmPassword"],
		})
