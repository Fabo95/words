import { z } from "zod"

import { $api } from "@app/utils/api/apiRequests"
import { TFunction } from "@app/utils/types/tFunction"
import { getQueryClient } from "@app/utils/reactQuery/reactQueryHelpers"
import { emailSchema } from "@app/utils/schemas/schemas"

export const getLoginFormSchema = (t: TFunction) =>
	z.object({
		email: z
			.string()
			.email({ message: t("forms.loginForm.error.email") })
			.refine(
				async (email) => {
					const result = emailSchema.safeParse(email)

					// If the current value does not fit the shape of an email we ignore the BE validation.
					if (!result.success) {
						return true
					}

					const queryClient = getQueryClient()

					const { response_object } = await queryClient.fetchQuery(
						$api.queryOptions("post", "/user/check", { body: { email } }),
					)

					return response_object?.isEmailValid
				},
				{ message: t("forms.loginForm.error.emailDoesNotExist") },
			),
		password: z.string().min(8, { message: t("forms.loginForm.error.password") }),
	})
