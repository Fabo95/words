"use client";

import * as React from "react";

import { useToast } from "@app/components/ui/use-toast";
import { useClientTFunction } from "@app/utils/i18n/utils/i18nHooks";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@app/components/ui/card";
import { Form, FormProvider } from "@app/components/ui/form";
import { FormField } from "@app/components/ui/formField";
import { Input } from "@app/components/ui/input";
import { Button } from "@app/components/ui/button";
import { getAccountPasswordFormSchema } from "@app/app/[lang]/(loggedIn)/account/_content/accountPasswordForm/utils/accountPasswordFormSchema";
import { AccountPasswordFormState } from "@app/app/[lang]/(loggedIn)/account/_content/accountPasswordForm/utils/accountPasswordFormTypes";

export const AccountPasswordForm = () => {
    // --- STATE ---

    const { toast } = useToast();

    const t = useClientTFunction();

    const router = useRouter();

    const form = useForm<AccountPasswordFormState>({
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
        mode: "onBlur",
        resolver: zodResolver(getAccountPasswordFormSchema(t)),
    });

    // --- RENDER ---

    return (
        <Card className="max-w-[400px] w-full">
            <CardHeader>
                <CardTitle>{t("pages.account.password.title")}</CardTitle>

                <CardDescription>{t("pages.account.password.description")}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-2">
                <FormProvider {...form}>
                    <Form>
                        <FormField
                            className="mb-5"
                            control={form.control}
                            label={t("pages.account.password.passwordLabel")}
                            placeholder={t("pages.account.password.passwordPlaceholder")}
                            name="password"
                            inputType="password"
                            input={Input}
                        />

                        <FormField
                            control={form.control}
                            label={t("pages.account.password.passwordConfirmLabel")}
                            placeholder={t("pages.account.password.passwordConfirmPlaceholder")}
                            name="confirmPassword"
                            inputType="password"
                            input={Input}
                        />

                        <Button disabled={!form.formState.isValid} className="mt-5">
                            {t("pages.account.password.button")}
                        </Button>
                    </Form>
                </FormProvider>
            </CardContent>
        </Card>
    );
};
