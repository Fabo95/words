import { z } from "zod";
import { getLoginFormSchema } from "@app/block/authentication/loginCardContent/utils/loginCardContentSchema";

export type LoginFormState = z.infer<ReturnType<typeof getLoginFormSchema>>;
