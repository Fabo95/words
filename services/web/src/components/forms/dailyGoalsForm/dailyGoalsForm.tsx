"use client"

import { useTranslations } from "next-intl"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@app/components/ui/button"
import { Input } from "@app/components/ui/input"
import { Label } from "@app/components/ui/label"
import { getDailyGoalsQueryOptions } from "@app/utils/reactQuery/queryOptions"
import { $api } from "@app/utils/api/apiRequests"
import { useToast } from "@app/components/ui/use-toast"
import { getDailyGoalsFormSchema } from "@app/components/forms/dailyGoalsForm/utils/dailyGoalsFormSchema"
import { DailyGoalsFormState } from "@app/components/forms/dailyGoalsForm/utils/dailyGoalsFormTypes"

type DailyGoalsFormProps = {
	defaultValues: Partial<DailyGoalsFormState>
}

export const DailyGoalsForm = ({ defaultValues }: DailyGoalsFormProps) => {
	const t = useTranslations()
	const { toast } = useToast()
	const queryClient = useQueryClient()

	const updateMutation = $api.useMutation("patch", "/daily-goals", {
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: getDailyGoalsQueryOptions().queryKey })
			toast({
				title: t("forms.dailyGoalsForm.toast.success.title"),
				description: t("forms.dailyGoalsForm.toast.success.description"),
			})
		},
		onError: () => {
			toast({
				title: t("forms.dailyGoalsForm.toast.error.title"),
				description: t("forms.dailyGoalsForm.toast.error.description"),
			})
		},
	})

	const form = useForm<DailyGoalsFormState>({
		resolver: zodResolver(getDailyGoalsFormSchema(t)),
		defaultValues,
	})

	const onSubmit = (values: DailyGoalsFormState) => {
		updateMutation.mutate({
			body: {
				daily_add_words_goal: values.daily_add_words_goal,
			},
		})
	}

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
			<h4 className="text-sm font-medium">{t("forms.dailyGoalsForm.settingsTitle")}</h4>
			<div className="space-y-2">
				<Label htmlFor="daily_add_words_goal">{t("forms.dailyGoalsForm.goalLabel")}</Label>
				<Input id="daily_add_words_goal" type="number" min={1} max={100} {...form.register("daily_add_words_goal")} />
				{form.formState.errors.daily_add_words_goal && (
					<p className="text-sm text-destructive">{t("forms.dailyGoalsForm.goalError")}</p>
				)}
			</div>
			<Button className="w-full" type="submit" isLoading={updateMutation.isPending}>
				{t("forms.dailyGoalsForm.saveButton")}
			</Button>
		</form>
	)
}
