import { z } from "zod"

import { getLoginFormSchema } from "services/words/src/app/[lang]/(loggedOut)/authentication/_content/loginForm/utils/loginFormSchema"

export type LoginFormState = z.infer<ReturnType<typeof getLoginFormSchema>>
