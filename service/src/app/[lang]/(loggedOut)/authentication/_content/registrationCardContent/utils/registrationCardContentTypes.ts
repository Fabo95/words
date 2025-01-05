import { z } from "zod";

import { getRegistrationFormSchema } from "@app/app/[lang]/(loggedOut)/authentication/_content/registrationCardContent/utils/registrationCardContentSchema";

export type RegistrationFormState = z.infer<ReturnType<typeof getRegistrationFormSchema>>;
