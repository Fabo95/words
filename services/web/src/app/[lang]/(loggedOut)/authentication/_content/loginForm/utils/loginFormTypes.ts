import { z } from "zod"

import { getLoginFormSchema } from "@app/app/[lang]/(loggedOut)/authentication/_content/loginForm/utils/loginFormSchema"

export type LoginFormState = z.infer<ReturnType<typeof getLoginFormSchema>>
