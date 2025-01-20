import { z } from "zod";

import { getAccountFormSchema } from "@app/app/[lang]/(loggedIn)/account/_content/utils/accountFormSchema";

export type AccountFormState = z.infer<ReturnType<typeof getAccountFormSchema>>;
