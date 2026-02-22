"use client"

import * as React from "react"

import { getAccountNameFormSchema } from "@app/components/forms/accountNameForm/utils/accountNameFormSchema"
import { AccountNameFormState } from "@app/components/forms/accountNameForm/utils/accountNameFormTypes"
import { Button } from "@app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@app/components/ui/card"
import { Form, FormProvider } from "@app/components/ui/form"
import { FormField } from "@app/components/ui/formField"
import { Input } from "@app/components/ui/input"
import { ResponsiveTooltip } from "@app/components/ui/responsive-tooltip"
import { useToast } from "@app/components/ui/use-toast"
import { $api } from "@app/utils/api/apiRequests"
import { useTranslations } from "next-intl"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { useCallback } from "react"
import { useForm } from "react-hook-form"
import { getUserQueryOptions } from "@app/utils/reactQuery/queryOptions"

export const AccountNameForm = () => {
	// --- STATE ---

	const t = useTranslations()

	const { toast } = useToast()

	const queryClient = useQueryClient()

	const { data } = useSuspenseQuery(getUserQueryOptions())

	const { mutateAsync: mutateUserUpdate } = $api.useMutation("patch", "/user", {
		onSuccess: (data) => {
			queryClient.setQueryData(["get", "/user"], data)

			toast({
				title: t("forms.accountNameForm.toast.success.title"),
				description: t("forms.accountNameForm.toast.success.description"),
			})
		},
		onError: () => {
			toast({
				title: t("forms.accountNameForm.toast.error.title"),
				description: t("forms.accountNameForm.toast.error.description"),
			})
		},
	})

	const form = useForm<AccountNameFormState>({
		defaultValues: {
			email: data?.data?.email ?? "",
			name: data?.data?.name || "",
		},
		mode: "onChange",
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
				<CardTitle>{t("forms.accountNameForm.title")}</CardTitle>

				<CardDescription>{t("forms.accountNameForm.description")}</CardDescription>
			</CardHeader>

			<CardContent className="space-y-2">
				<FormProvider {...form}>
					<Form onSubmit={form.handleSubmit(onSubmit)}>
						<ResponsiveTooltip
							className="w-full text-left"
							content={t("forms.accountNameForm.emailTooltip")}
							title={t("forms.accountNameForm.emailLabel")}
						>
							<FormField
								className="mb-5 w-full"
								control={form.control}
								label={t("forms.accountNameForm.emailLabel")}
								name="email"
								render={(fieldProps) => <Input disabled={true} type="email" {...fieldProps.field} />}
							/>
						</ResponsiveTooltip>

						<FormField
							control={form.control}
							className="mb-8"
							label={t("forms.accountNameForm.nameLabel")}
							name="name"
							render={(fieldProps) => (
								<Input placeholder={t("forms.accountNameForm.namePlaceholder")} type="text" {...fieldProps.field} />
							)}
						/>

						<Button disabled={!form.formState.isValid || !form.formState.isDirty}>
							{t("forms.accountNameForm.button")}
						</Button>
					</Form>
				</FormProvider>
			</CardContent>
		</Card>
	)
}
