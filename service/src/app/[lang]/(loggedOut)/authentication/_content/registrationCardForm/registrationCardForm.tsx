"use client";
import { useCallback } from "react";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@app/components/ui/card";
import { Input } from "@app/components/ui/input";
import { Button } from "@app/components/ui/button";
import { useClientTFunction } from "@app/utils/i18n/utils/i18nHooks";
import { getRegistrationFormSchema } from "@app/app/[lang]/(loggedOut)/authentication/_content/registrationCardForm/utils/registrationCardFormSchema";
import { RegistrationFormState } from "@app/app/[lang]/(loggedOut)/authentication/_content/registrationCardForm/utils/registrationCardFormTypes";
import { Form, FormProvider } from "@app/components/ui/form";
import { FormField } from "@app/components/ui/formField";
import { apiPostUserCreate } from "@app/utils/api/apiRequests";
import { Page } from "@app/utils/routing/routingTypes";
import { useToast } from "@app/components/ui/use-toast";

export const RegistrationCardForm = () => {
    // --- STATE ---

    const { toast } = useToast();

    const t = useClientTFunction();

    const router = useRouter();

    const form = useForm<RegistrationFormState>({
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
        mode: "onBlur",
        resolver: zodResolver(getRegistrationFormSchema(t)),
    });

    // --- CALLBACKS ---

    const onSubmit = useCallback(
        async (values: RegistrationFormState) => {
            try {
                await apiPostUserCreate(values);

                router.push(`/${Page.HOME}`);
            } catch (errorResponse) {
                if (errorResponse.status === 401) {
                    form.setError("confirmPassword", {
                        message: t("pages.authentication.registration.error.passwordDoesNotMatch"),
                    });

                    return;
                }

                toast({
                    title: t("pages.authentication.registration.error.toastTitle"),
                    description: t("pages.authentication.registration.error.toastDescription"),
                });
            }
        },
        [form]
    );

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
                            input={Input}
                            label={t("pages.authentication.registration.labelOne")}
                            name="email"
                            placeholder={t("pages.authentication.registration.placeholderOne")}
                        />

                        <FormField
                            className="mb-5"
                            control={form.control}
                            input={Input}
                            label={t("pages.authentication.registration.labelTwo")}
                            name="password"
                            inputType="password"
                            placeholder={t("pages.authentication.registration.placeholderTwo")}
                        />

                        <FormField
                            control={form.control}
                            input={Input}
                            label={t("pages.authentication.registration.labelThree")}
                            name="confirmPassword"
                            inputType="password"
                            placeholder={t("pages.authentication.registration.placeholderThree")}
                        />

                        <Button disabled={!form.formState.isValid} className="mt-5">
                            {t("pages.authentication.registration.button")}
                        </Button>
                    </Form>
                </FormProvider>
            </CardContent>
        </Card>
    );
};
