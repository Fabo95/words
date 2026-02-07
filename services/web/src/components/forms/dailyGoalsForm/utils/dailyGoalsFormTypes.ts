import { z } from "zod"

import { getDailyGoalsFormSchema } from "@app/components/forms/dailyGoalsForm/utils/dailyGoalsFormSchema"

export type DailyGoalsFormState = z.infer<ReturnType<typeof getDailyGoalsFormSchema>>
