"use client";

import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@app/components/ui/card";
import { Input } from "@app/components/ui/input";
import { Button } from "@app/components/ui/button";
import { getTFunction } from "@app/utils/i18n/tFunction";
import { Locale } from "@app/utils/locale/localeTypes";
import { LoginFormState } from "@app/app/[lang]/(loggedOut)/authentication/_content/loginCardContent/utils/loginCardContentTypes";
import { getLoginFormSchema } from "@app/app/[lang]/(loggedOut)/authentication/_content/loginCardContent/utils/loginCardContentSchema";
import { Form, FormProvider } from "@app/components/ui/form";
import { FormField } from "@app/components/ui/formField";

export const LoginCardContent = () => {
    // --- STATE ---

    const { lang } = useParams<Record<"lang", Locale>>();

    const t = getTFunction(lang);

    const form = useForm<LoginFormState>({
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onBlur",
        resolver: zodResolver(getLoginFormSchema(t)),
    });

    // --- CALLBACKS ---

    const onSubmit = useCallback((values: LoginFormState) => {
        console.log(values);
    }, []);

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
                            label={t("pages.authentication.login.labelOne")}
                            name="email"
                            input={Input}
                            placeholder={t("pages.authentication.login.placeholderOne")}
                        />

                        <FormField
                            control={form.control}
                            label={t("pages.authentication.login.labelTwo")}
                            placeholder={t("pages.authentication.login.placeholderTwo")}
                            name="password"
                            input={Input}
                        />

                        <Button className="mt-5">{t("pages.authentication.login.submit")}</Button>
                    </Form>
                </FormProvider>
            </CardContent>
        </Card>
    );
};
