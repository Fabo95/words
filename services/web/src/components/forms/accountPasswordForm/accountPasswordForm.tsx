"use client"

import * as React from "react"

import { getAccountPasswordFormSchema } from "@app/components/forms/accountPasswordForm/utils/accountPasswordFormSchema"
import { AccountPasswordFormState } from "@app/components/forms/accountPasswordForm/utils/accountPasswordFormTypes"
import { Button } from "@app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@app/components/ui/card"
import { Form, FormProvider } from "@app/components/ui/form"
import { FormField } from "@app/components/ui/formField"
import { Input } from "@app/components/ui/input"
import { useToast } from "@app/components/ui/use-toast"
import { $api } from "@app/utils/api/apiRequests"
import { useTranslations } from "next-intl"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback } from "react"
import { useForm } from "react-hook-form"

export const AccountPasswordForm = () => {
	// --- STATE ---

	const { toast } = useToast()

	const t = useTranslations()

	const { mutateAsync: mutateUserUpdate } = $api.useMutation("patch", "/user", {
		onSuccess: (data) => {
			toast({
				title: t("forms.accountPasswordForm.toast.success.title"),
				description: t("forms.accountPasswordForm.toast.success.description"),
			})
		},
		onError: () => {
			toast({
				title: t("forms.accountPasswordForm.toast.error.title"),
				description: t("forms.accountPasswordForm.toast.error.description"),
			})
		},
	})

	const form = useForm<AccountPasswordFormState>({
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
		mode: "onBlur",
		resolver: zodResolver(getAccountPasswordFormSchema(t)),
	})

	// --- CALLBACKS ---

	const onSubmit = useCallback(
		async (value: AccountPasswordFormState) => {
			await mutateUserUpdate({ body: { password: value.password, confirmPassword: value.confirmPassword } })
		},
		[mutateUserUpdate],
	)

	// --- RENDER ---

	return (
		<Card className="max-w-[400px] w-full">
			<CardHeader>
				<CardTitle>{t("forms.accountPasswordForm.title")}</CardTitle>

				<CardDescription>{t("forms.accountPasswordForm.description")}</CardDescription>
			</CardHeader>

			<CardContent className="space-y-2">
				<FormProvider {...form}>
					<Form onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							className="mb-5"
							control={form.control}
							label={t("forms.accountPasswordForm.passwordLabel")}
							name="password"
							render={(fieldProps) => (
								<Input
									placeholder={t("forms.accountPasswordForm.passwordPlaceholder")}
									type="password"
									{...fieldProps.field}
								/>
							)}
						/>

						<FormField
							control={form.control}
							className="mb-8"
							label={t("forms.accountPasswordForm.passwordConfirmLabel")}
							name="confirmPassword"
							render={(fieldProps) => (
								<Input
									placeholder={t("forms.accountPasswordForm.passwordConfirmPlaceholder")}
									type="password"
									{...fieldProps.field}
								/>
							)}
						/>

						<Button disabled={!form.formState.isValid}>{t("forms.accountPasswordForm.button")}</Button>
					</Form>
				</FormProvider>
			</CardContent>
		</Card>
	)
}
