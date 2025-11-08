import { z } from "zod"

import { getAccountPasswordFormSchema } from "@app/components/forms/accountPasswordForm/utils/accountPasswordFormSchema"

export type AccountPasswordFormState = z.infer<ReturnType<typeof getAccountPasswordFormSchema>>
