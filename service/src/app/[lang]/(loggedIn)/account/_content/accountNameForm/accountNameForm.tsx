"use client"

import * as React from "react"

import { getAccountNameFormSchema } from "@app/app/[lang]/(loggedIn)/account/_content/accountNameForm/utils/accountNameFormSchema"
import { AccountNameFormState } from "@app/app/[lang]/(loggedIn)/account/_content/accountNameForm/utils/accountNameFormTypes"
import { Button } from "@app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@app/components/ui/card"
import { Form, FormProvider } from "@app/components/ui/form"
import { FormField } from "@app/components/ui/formField"
import { Input } from "@app/components/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@app/components/ui/tooltip"
import { useToast } from "@app/components/ui/use-toast"
import { $api } from "@app/utils/api/apiRequests"
import { useClientTFunction } from "@app/utils/i18n/utils/i18nHooks"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"
import { useForm } from "react-hook-form"

export const AccountNameForm = () => {
	// --- STATE ---

	const t = useClientTFunction()

	const { toast } = useToast()

	const queryClient = useQueryClient()

	const {
		data: { response_object },
	} = $api.useSuspenseQuery("get", "/user")

	const { mutateAsync: mutateUserUpdate } = $api.useMutation("patch", "/user", {
		onSuccess: (data) => {
			// See: https://tanstack.com/query/v5/docs/framework/react/guides/updates-from-mutation-responses
			// TODO FIX
			queryClient.setQueryData(["get", "/user"], data)

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

	const form = useForm<AccountNameFormState>({
		defaultValues: {
			email: response_object?.email ?? "",
			name: response_object?.name || "",
		},
		mode: "onBlur",
		resolver: zodResolver(getAccountNameFormSchema(t)),
	})

	// --- CALLBACKS ---

	const onSubmit = useCallback(
		async (value: AccountNameFormState) => {
			await mutateUserUpdate({ body: { name: value.name } })
		},
		[mutateUserUpdate],
	)

	// --- RENDER ---

	return (
		<Card className="max-w-[400px] w-full">
			<CardHeader>
				<CardTitle>{t("pages.account.name.title")}</CardTitle>

				<CardDescription>{t("pages.account.name.description")}</CardDescription>
			</CardHeader>

			<CardContent className="space-y-2">
				<FormProvider {...form}>
					<Form onSubmit={form.handleSubmit(onSubmit)}>
						<Tooltip>
							<TooltipContent>{t("pages.account.name.emailTooltip")}</TooltipContent>

							<TooltipTrigger className="w-full text-left">
								<FormField
									className="mb-5"
									control={form.control}
									label={t("pages.account.name.emailLabel")}
									name="email"
									disabled={true}
									input={Input}
								/>
							</TooltipTrigger>
						</Tooltip>

						<FormField
							control={form.control}
							label={t("pages.account.name.nameLabel")}
							placeholder={t("pages.account.name.namePlaceholder")}
							name="name"
							input={Input}
						/>

						<Button disabled={!form.formState.isValid || !form.formState.isDirty} className="mt-5">
							{t("pages.account.name.button")}
						</Button>
					</Form>
				</FormProvider>
			</CardContent>
		</Card>
	)
}
