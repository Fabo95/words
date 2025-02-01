"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@app/components/ui/card";
import { Input } from "@app/components/ui/input";
import { Button } from "@app/components/ui/button";
import { useClientTFunction } from "@app/utils/i18n/utils/i18nHooks";
import { LoginFormState } from "@app/app/[lang]/(loggedOut)/authentication/_content/loginForm/utils/loginFormTypes";
import { getLoginFormSchema } from "@app/app/[lang]/(loggedOut)/authentication/_content/loginForm/utils/loginFormSchema";
import { Form, FormProvider } from "@app/components/ui/form";
import { FormField } from "@app/components/ui/formField";
import { apiPostUserLogin } from "@app/utils/api/apiRequests";
import { useToast } from "@app/components/ui/use-toast";
import { Page } from "@app/utils/routing/routingTypes";
import { useMutation } from "@tanstack/react-query";

export const LoginForm = () => {
    // --- STATE ---

    const { toast } = useToast();

    const t = useClientTFunction();

    const router = useRouter();

    const form = useForm<LoginFormState>({
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onBlur",
        resolver: zodResolver(getLoginFormSchema(t)),
    });

    const { mutateAsync: mutateUserLogin } = useMutation({
        mutationFn: (value: LoginFormState) => apiPostUserLogin(value),
        onSuccess: () => {
            router.push(`/${Page.HOME}`);
        },
        onError: (error) => {
            // Fix this.
            if (error.cause === 401) {
                form.setError("password", { message: t("pages.authentication.login.error.passwordDoesNotMatch") });

                return;
            }

            toast({
                title: t("pages.authentication.login.error.toastTitle"),
                description: t("pages.authentication.login.error.toastDescription"),
            });
        },
    });

    // --- CALLBACKS ---

    const onSubmit = useCallback(
        async (value: LoginFormState) => {
            await mutateUserLogin(value);
        },
        [form]
    );

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
                            input={Input}
                            placeholder={t("pages.authentication.login.emailPlaceholder")}
                        />

                        <FormField
                            control={form.control}
                            label={t("pages.authentication.login.passwordLabel")}
                            placeholder={t("pages.authentication.login.passwordPlaceholder")}
                            name="password"
                            inputType="password"
                            input={Input}
                        />

                        <Button disabled={!form.formState.isValid} className="mt-5">
                            {t("pages.authentication.login.button")}
                        </Button>
                    </Form>
                </FormProvider>
            </CardContent>
        </Card>
    );
};
