import { z } from "zod"

import { getAccountPasswordFormSchema } from "@app/app/[lang]/(loggedIn)/account/_content/accountPasswordForm/utils/accountPasswordFormSchema"

export type AccountPasswordFormState = z.infer<ReturnType<typeof getAccountPasswordFormSchema>>
