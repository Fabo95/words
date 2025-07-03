"use client"
import { useCallback } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { getRegistrationFormSchema } from "@app/app/[lang]/(loggedOut)/authentication/_content/registrationForm/utils/registrationFormSchema"
import { RegistrationFormState } from "@app/app/[lang]/(loggedOut)/authentication/_content/registrationForm/utils/registrationFormTypes"
import { Button } from "@app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@app/components/ui/card"
import { Form, FormProvider } from "@app/components/ui/form"
import { FormField } from "@app/components/ui/formField"
import { Input } from "@app/components/ui/input"
import { useToast } from "@app/components/ui/use-toast"
import { $api } from "@app/utils/api/apiRequests"
import { useClientTFunction } from "@app/utils/i18n/utils/i18nHooks"
import { Page } from "@app/utils/routing/routingTypes"
import * as React from "react"

export const RegistrationForm = () => {
	// --- STATE ---

	const { toast } = useToast()

	const t = useClientTFunction()

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
				title: t("pages.authentication.registration.error.toastTitle"),
				description: t("pages.authentication.registration.error.toastDescription"),
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
				<CardTitle>{t("pages.authentication.registration.title")}</CardTitle>

				<CardDescription>{t("pages.authentication.registration.description")}</CardDescription>
			</CardHeader>

			<CardContent className="space-y-2">
				<FormProvider {...form}>
					<Form onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							className="mb-5"
							control={form.control}
							label={t("pages.authentication.registration.emailLabel")}
							name="email"
							render={(fieldProps) => (
								<Input
									placeholder={t("pages.authentication.registration.emailPlaceholder")}
									type="email"
									{...fieldProps.field}
								/>
							)}
						/>

						<FormField
							className="mb-5"
							control={form.control}
							label={t("pages.authentication.registration.passwordLabel")}
							name="password"
							render={(fieldProps) => (
								<Input
									placeholder={t("pages.authentication.registration.passwordPlaceholder")}
									type="password"
									{...fieldProps.field}
								/>
							)}
						/>

						<FormField
							control={form.control}
							label={t("pages.authentication.registration.passwordConfirmLabel")}
							name="confirmPassword"
							render={(fieldProps) => (
								<Input
									placeholder={t("pages.authentication.registration.passwordConfirmPlaceholder")}
									type="password"
									{...fieldProps.field}
								/>
							)}
						/>

						<Button disabled={!form.formState.isValid} className="mt-5">
							{t("pages.authentication.registration.button")}
						</Button>
					</Form>
				</FormProvider>
			</CardContent>
		</Card>
	)
}
