"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useCallback } from "react"
import { useForm } from "react-hook-form"

import { getLoginFormSchema } from "services/words/src/app/[lang]/(loggedOut)/authentication/_content/loginForm/utils/loginFormSchema"
import { LoginFormState } from "services/words/src/app/[lang]/(loggedOut)/authentication/_content/loginForm/utils/loginFormTypes"
import { Button } from "services/words/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "services/words/src/components/ui/card"
import { Form, FormProvider } from "services/words/src/components/ui/form"
import { FormField } from "services/words/src/components/ui/formField"
import { Input } from "services/words/src/components/ui/input"
import { useToast } from "services/words/src/components/ui/use-toast"
import { $api } from "services/words/src/utils/api/apiRequests"
import { Page } from "services/words/src/utils/types/pageTypes"
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
				title: t("pages.authentication.login.error.toastTitle"),
				description: t("pages.authentication.login.error.toastDescription"),
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
				<CardTitle>{t("pages.authentication.login.title")}</CardTitle>

				<CardDescription>{t("pages.authentication.login.description")}</CardDescription>
			</CardHeader>

			<CardContent className="space-y-2">
				<FormProvider {...form}>
					<Form onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							className="mb-5"
							control={form.control}
							label={t("pages.authentication.login.emailLabel")}
							name="email"
							render={(fieldProps) => (
								<Input
									type="email"
									placeholder={t("pages.authentication.login.emailPlaceholder")}
									{...fieldProps.field}
								/>
							)}
						/>

						<FormField
							control={form.control}
							label={t("pages.authentication.login.passwordLabel")}
							name="password"
							render={(fieldProps) => (
								<Input
									type="password"
									placeholder={t("pages.authentication.login.passwordPlaceholder")}
									{...fieldProps.field}
								/>
							)}
						/>

						<Button disabled={!form.formState.isValid} className="mt-5">
							{t("pages.authentication.login.button")}
						</Button>
					</Form>
				</FormProvider>
			</CardContent>
		</Card>
	)
}
