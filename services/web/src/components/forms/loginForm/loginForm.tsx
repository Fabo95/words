"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useCallback } from "react"
import { useForm } from "react-hook-form"

import { getLoginFormSchema } from "@app/components/forms/loginForm/utils/loginFormSchema"
import { LoginFormState } from "@app/components/forms/loginForm/utils/loginFormTypes"
import { Button } from "@app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@app/components/ui/card"
import { Form, FormProvider } from "@app/components/ui/form"
import { FormField } from "@app/components/ui/formField"
import { Input } from "@app/components/ui/input"
import { useToast } from "@app/components/ui/use-toast"
import { $api } from "@app/utils/api/apiRequests"
import { Page } from "@app/utils/types/pageTypes"
import { useTranslations } from "next-intl"

export const LoginForm = () => {
	// --- STATE ---

	const { toast } = useToast()

	const t = useTranslations()

	const router = useRouter()

	const form = useForm<LoginFormState>({
		defaultValues: {
			email: "",
			password: "",
		},
		mode: "onBlur",
		resolver: zodResolver(getLoginFormSchema(t)),
	})

	const { mutateAsync: mutateUserLogin } = $api.useMutation("post", "/user/login", {
		onSuccess: () => {
			router.push(`/${Page.HOME}`)
		},
		onError: () => {
			toast({
				title: t("forms.loginForm.error.toastTitle"),
				description: t("forms.loginForm.error.toastDescription"),
			})
		},
	})

	// --- CALLBACKS ---

	const onSubmit = useCallback(
		async (value: LoginFormState) => {
			await mutateUserLogin({ body: { email: value.email, password: value.password } })
		},
		[mutateUserLogin],
	)

	// --- RENDER ---

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t("forms.loginForm.title")}</CardTitle>

				<CardDescription>{t("forms.loginForm.description")}</CardDescription>
			</CardHeader>

			<CardContent className="space-y-2">
				<FormProvider {...form}>
					<Form onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							className="mb-5"
							control={form.control}
							label={t("forms.loginForm.emailLabel")}
							name="email"
							render={(fieldProps) => (
								<Input type="email" placeholder={t("forms.loginForm.emailPlaceholder")} {...fieldProps.field} />
							)}
						/>

						<FormField
							control={form.control}
							label={t("forms.loginForm.passwordLabel")}
							name="password"
							render={(fieldProps) => (
								<Input type="password" placeholder={t("forms.loginForm.passwordPlaceholder")} {...fieldProps.field} />
							)}
						/>

						<Button disabled={!form.formState.isValid} className="mt-5">
							{t("forms.loginForm.button")}
						</Button>
					</Form>
				</FormProvider>
			</CardContent>
		</Card>
	)
}
