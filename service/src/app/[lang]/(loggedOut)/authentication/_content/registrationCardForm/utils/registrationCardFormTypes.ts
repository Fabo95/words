import { z } from "zod";

import { getRegistrationFormSchema } from "@app/app/[lang]/(loggedOut)/authentication/_content/registrationCardForm/utils/registrationCardFormSchema";

export type RegistrationFormState = z.infer<ReturnType<typeof getRegistrationFormSchema>>;
