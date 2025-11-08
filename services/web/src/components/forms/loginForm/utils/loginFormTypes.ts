import { z } from "zod"

import { getLoginFormSchema } from "@app/components/forms/loginForm/utils/loginFormSchema"

export type LoginFormState = z.infer<ReturnType<typeof getLoginFormSchema>>
