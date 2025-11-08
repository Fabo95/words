import { z } from "zod"

import { getRegistrationFormSchema } from "@app/components/forms/registrationForm/utils/registrationFormSchema"

export type RegistrationFormState = z.infer<ReturnType<typeof getRegistrationFormSchema>>
