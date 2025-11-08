import { z } from "zod"

import { getAccountNameFormSchema } from "@app/components/forms/accountNameForm/utils/accountNameFormSchema"

export type AccountNameFormState = z.infer<ReturnType<typeof getAccountNameFormSchema>>
