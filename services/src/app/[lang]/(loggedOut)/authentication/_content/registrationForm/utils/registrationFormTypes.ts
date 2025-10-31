import { z } from "zod";

import { getRegistrationFormSchema } from "@app/app/[lang]/(loggedOut)/authentication/_content/registrationForm/utils/registrationFormSchema";

export type RegistrationFormState = z.infer<ReturnType<typeof getRegistrationFormSchema>>;
