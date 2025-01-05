import { z } from "zod";

import { getLoginFormSchema } from "@app/app/[lang]/(loggedOut)/authentication/_content/loginCardContent/utils/loginCardContentSchema";

export type LoginFormState = z.infer<ReturnType<typeof getLoginFormSchema>>;
