import { z } from "zod"

import { $api } from "@app/utils/api/apiRequests"
import { TFunction } from "@app/utils/types/tFunction"
import { getQueryClient } from "@app/utils/reactQuery/reactQueryHelpers"
import { emailSchema } from "@app/utils/schemas/schemas"

export const getRegistrationFormSchema = (t: TFunction) =>
	z
		.object({
			email: z
				.string()
				.email({ message: t("forms.registrationForm.error.email") })
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
					{ message: t("forms.registrationForm.error.emailDoesExist") },
				),
			password: z.string().min(8, { message: t("forms.registrationForm.error.password") }),
			confirmPassword: z.string().min(8, { message: t("forms.registrationForm.error.password") }),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: t("forms.registrationForm.error.passwordDoesNotMatch"),
			path: ["confirmPassword"],
		})
