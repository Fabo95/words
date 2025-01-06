"use client";
import { useCallback } from "react";

import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@app/components/ui/card";
import { Input } from "@app/components/ui/input";
import { Button } from "@app/components/ui/button";
import { getTFunction } from "@app/utils/i18n/tFunction";
import { Locale } from "@app/utils/locale/localeTypes";
import { getRegistrationFormSchema } from "@app/app/[lang]/(loggedOut)/authentication/_content/registrationCardContent/utils/registrationCardContentSchema";
import { RegistrationFormState } from "@app/app/[lang]/(loggedOut)/authentication/_content/registrationCardContent/utils/registrationCardContentTypes";
import { Form, FormProvider } from "@app/components/ui/form";
import { LoginFormState } from "@app/app/[lang]/(loggedOut)/authentication/_content/loginCardContent/utils/loginCardContentTypes";
import { FormField } from "@app/components/ui/formField";

export const RegistrationCardContent = () => {
    // --- STATE ---

    const { lang } = useParams<Record<"lang", Locale>>();

    const t = getTFunction(lang);

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

    const onSubmit = useCallback((values: LoginFormState) => {
        console.log(values);
    }, []);

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
                            placeholder={t("pages.authentication.registration.placeholderTwo")}
                        />

                        <FormField
                            control={form.control}
                            input={Input}
                            label={t("pages.authentication.registration.labelThree")}
                            name="confirmPassword"
                            placeholder={t("pages.authentication.registration.placeholderThree")}
                        />

                        <Button className="mt-5">{t("pages.authentication.registration.submit")}</Button>
                    </Form>
                </FormProvider>
            </CardContent>
        </Card>
    );
};
