"use client"

import * as React from "react"

import { getAccountPasswordFormSchema } from "services/words/src/app/[lang]/(loggedIn)/account/_content/accountPasswordForm/utils/accountPasswordFormSchema"
import { AccountPasswordFormState } from "services/words/src/app/[lang]/(loggedIn)/account/_content/accountPasswordForm/utils/accountPasswordFormTypes"
import { Button } from "services/words/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "services/words/src/components/ui/card"
import { Form, FormProvider } from "services/words/src/components/ui/form"
import { FormField } from "services/words/src/components/ui/formField"
import { Input } from "services/words/src/components/ui/input"
import { useToast } from "services/words/src/components/ui/use-toast"
import { $api } from "services/words/src/utils/api/apiRequests"
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
				title: t("pages.account.name.toast.success.title"),
				description: t("pages.account.name.toast.success.description"),
			})
		},
		onError: () => {
			toast({
				title: t("pages.account.name.toast.error.title"),
				description: t("pages.account.name.toast.error.description"),
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
				<CardTitle>{t("pages.account.password.title")}</CardTitle>

				<CardDescription>{t("pages.account.password.description")}</CardDescription>
			</CardHeader>

			<CardContent className="space-y-2">
				<FormProvider {...form}>
					<Form onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							className="mb-5"
							control={form.control}
							label={t("pages.account.password.passwordLabel")}
							name="password"
							render={(fieldProps) => (
								<Input
									placeholder={t("pages.account.password.passwordPlaceholder")}
									type="password"
									{...fieldProps.field}
								/>
							)}
						/>

						<FormField
							control={form.control}
							label={t("pages.account.password.passwordConfirmLabel")}
							name="confirmPassword"
							render={(fieldProps) => (
								<Input
									placeholder={t("pages.account.password.passwordConfirmPlaceholder")}
									type="password"
									{...fieldProps.field}
								/>
							)}
						/>

						<Button disabled={!form.formState.isValid} className="mt-5">
							{t("pages.account.password.button")}
						</Button>
					</Form>
				</FormProvider>
			</CardContent>
		</Card>
	)
}
