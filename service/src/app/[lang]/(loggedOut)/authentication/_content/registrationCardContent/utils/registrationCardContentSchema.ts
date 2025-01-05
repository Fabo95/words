import { z } from "zod";

import { TFunction } from "@app/utils/i18n/utils/i18nTypes";

export const getRegistrationFormSchema = (t: TFunction) =>
    z.object({
        email: z.string().email({ message: t("pages.authentication.registration.errorMessage.email") }),
        password: z.string().min(8, { message: t("pages.authentication.registration.errorMessage.password") }),
        confirmPassword: z.string().min(8, { message: t("pages.authentication.registration.errorMessage.password") }),
    });
