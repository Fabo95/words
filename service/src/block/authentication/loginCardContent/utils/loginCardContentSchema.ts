import { z } from "zod";

import { TFunction } from "@app/lib/i18n/utils/i18nTypes";

export const getLoginFormSchema = (t: TFunction) =>
    z.object({
        email: z.string().email({ message: t("pages.authentication.login.errorMessage.email") }),
        password: z.string().min(8, { message: t("pages.authentication.login.errorMessage.password") }),
    });
