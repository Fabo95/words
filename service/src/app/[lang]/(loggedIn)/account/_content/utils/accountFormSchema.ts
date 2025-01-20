import { z } from "zod";

import { TFunction } from "@app/utils/i18n/utils/i18nTypes";

export const getAccountFormSchema = (t: TFunction) =>
    z
        .object({
            email: z
                .string()
                .email({ message: t("pages.authentication.login.error.email") })
                .readonly(),
            name: z
                .string()
                .min(2, { message: t("pages.authentication.login.error.password") })
                .optional(),
            password: z
                .string()
                .min(8, { message: t("pages.authentication.registration.error.password") })
                .optional(),
            confirmPassword: z
                .string()
                .min(8, { message: t("pages.authentication.registration.error.password") })
                .optional(),
        })
        .refine((data) => (!data.password && !data.confirmPassword) || data.password === data.confirmPassword, {
            message: t("pages.authentication.registration.error.passwordDoesNotMatch"),
            path: ["confirmPassword"],
        });
