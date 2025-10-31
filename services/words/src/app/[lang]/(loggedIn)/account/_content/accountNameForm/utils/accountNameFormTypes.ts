import { z } from "zod"

import { getAccountNameFormSchema } from "@app/app/[lang]/(loggedIn)/account/_content/accountNameForm/utils/accountNameFormSchema"

export type AccountNameFormState = z.infer<ReturnType<typeof getAccountNameFormSchema>>
