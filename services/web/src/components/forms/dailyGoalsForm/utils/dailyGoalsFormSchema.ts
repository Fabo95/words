import { z } from "zod"
import { TFunction } from "@app/utils/types/tFunction"

export const getDailyGoalsFormSchema = (t: TFunction) =>
	z.object({
		daily_add_words_goal: z.coerce
			.number({ message: t("forms.dailyGoalsForm.goalError") })
			.min(1, { message: t("forms.dailyGoalsForm.goalError") })
			.max(100, { message: t("forms.dailyGoalsForm.goalError") }),
	})
