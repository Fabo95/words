import { z } from "zod";

import { TFunction } from "@app/utils/i18n/utils/i18nTypes";
import { apiPostUserCheck } from "@app/utils/api/apiRequests";

const emailSchema = z.string().email();

export const getLoginFormSchema = (t: TFunction) =>
    z.object({
        email: z
            .string()
            .email({ message: t("pages.authentication.login.error.email") })
            .refine(
                async (email) => {
                    const result = emailSchema.safeParse(email);

                    // If the current value does not fit the shape of an email we ignore the BE validation.
                    if (!result.success) {
                        return true;
                    }

                    const { isEmailValid } = await apiPostUserCheck({ email });

                    return isEmailValid;
                },
                { message: t("pages.authentication.login.error.emailDoesNotExist") }
            ),
        password: z.string().min(8, { message: t("pages.authentication.login.error.password") }),
    });
