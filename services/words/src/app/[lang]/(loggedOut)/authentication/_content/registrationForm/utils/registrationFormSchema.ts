import { z } from "zod"

import { $api } from "services/words/src/utils/api/apiRequests"
import { TFunction } from "@app/utils/i18n/utils/i18nTypes"
import { getQueryClient } from "services/words/src/utils/reactQuery/reactQueryHelpers"
import { emailSchema } from "services/words/src/utils/schemas/schemas"

export const getRegistrationFormSchema = (t: TFunction) =>
	z
		.object({
			email: z
				.string()
				.email({ message: t("pages.authentication.registration.error.email") })
				.refine(
					async (email) => {
						const result = emailSchema.safeParse(email)

						// If the current value does not fit the shape of an email we ignore the BE validation.
						if (!result.success) {
							return true
						}

						const queryClient = getQueryClient()

						console.log("queryClient", queryClient)

						const { response_object } = await queryClient.fetchQuery(
							$api.queryOptions("post", "/user/check", { body: { email } }),
						)

						return !response_object?.isEmailValid
					},
					{ message: t("pages.authentication.registration.error.emailDoesExist") },
				),
			password: z.string().min(8, { message: t("pages.authentication.registration.error.password") }),
			confirmPassword: z.string().min(8, { message: t("pages.authentication.registration.error.password") }),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: t("pages.authentication.registration.error.passwordDoesNotMatch"),
			path: ["confirmPassword"],
		})
