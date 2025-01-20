import { z } from "zod";

import { TFunction } from "@app/utils/i18n/utils/i18nTypes";

export const getAccountNameFormSchema = (t: TFunction) =>
    z.object({
        email: z
            .string()
            .email({ message: t("pages.account.name.error.email") })
            .readonly(),
        name: z
            .string()
            .min(2, { message: t("pages.account.name.error.name") })
            .optional(),
    });
