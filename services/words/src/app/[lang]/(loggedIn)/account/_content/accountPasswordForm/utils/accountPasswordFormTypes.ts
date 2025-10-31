import { z } from "zod"

import { getAccountPasswordFormSchema } from "services/words/src/app/[lang]/(loggedIn)/account/_content/accountPasswordForm/utils/accountPasswordFormSchema"

export type AccountPasswordFormState = z.infer<ReturnType<typeof getAccountPasswordFormSchema>>
