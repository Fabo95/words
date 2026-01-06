"use client"
import { useCallback } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { getRegistrationFormSchema } from "@app/components/forms/registrationForm/utils/registrationFormSchema"
import { RegistrationFormState } from "@app/components/forms/registrationForm/utils/registrationFormTypes"
import { Button } from "@app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@app/components/ui/card"
import { Form, FormProvider } from "@app/components/ui/form"
import { FormField } from "@app/components/ui/formField"
import { Input } from "@app/components/ui/input"
import { useToast } from "@app/components/ui/use-toast"
import { $api } from "@app/utils/api/apiRequests"
import { useTranslations } from "next-intl"
import { Page } from "@app/utils/types/pageTypes"
import * as React from "react"

export const RegistrationForm = () => {
	// --- STATE ---

	const { toast } = useToast()

	const t = useTranslations()

	const router = useRouter()

	const form = useForm<RegistrationFormState>({
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
		mode: "onBlur",
		resolver: zodResolver(getRegistrationFormSchema(t)),
	})

	const { mutateAsync: mutateUserCreate } = $api.useMutation("post", "/user", {
		onSuccess: () => {
			router.push(`/${Page.HOME}`)
		},
		onError: () => {
			toast({
				title: t("forms.registrationForm.error.toastTitle"),
				description: t("forms.registrationForm.error.toastDescription"),
			})
		},
	})

	// --- CALLBACKS ---

	const onSubmit = useCallback(
		async (value: RegistrationFormState) => {
			await mutateUserCreate({
				body: { email: value.email, password: value.password, confirmPassword: value.confirmPassword },
			})
		},
		[mutateUserCreate],
	)

	// --- RENDER ---

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t("forms.registrationForm.title")}</CardTitle>

				<CardDescription>{t("forms.registrationForm.description")}</CardDescription>
			</CardHeader>

			<CardContent className="space-y-2">
				<FormProvider {...form}>
					<Form onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							className="mb-5"
							control={form.control}
							label={t("forms.registrationForm.emailLabel")}
							name="email"
							render={(fieldProps) => (
								<Input placeholder={t("forms.registrationForm.emailPlaceholder")} type="email" {...fieldProps.field} />
							)}
						/>

						<FormField
							className="mb-5"
							control={form.control}
							label={t("forms.registrationForm.passwordLabel")}
							name="password"
							render={(fieldProps) => (
								<Input
									placeholder={t("forms.registrationForm.passwordPlaceholder")}
									type="password"
									{...fieldProps.field}
								/>
							)}
						/>

						<FormField
							control={form.control}
							className="mb-8"
							label={t("forms.registrationForm.passwordConfirmLabel")}
							name="confirmPassword"
							render={(fieldProps) => (
								<Input
									placeholder={t("forms.registrationForm.passwordConfirmPlaceholder")}
									type="password"
									{...fieldProps.field}
								/>
							)}
						/>

						<Button disabled={!form.formState.isValid}>{t("forms.registrationForm.button")}</Button>
					</Form>
				</FormProvider>
			</CardContent>
		</Card>
	)
}
