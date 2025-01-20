"use client";

import * as React from "react";

import { useToast } from "@app/components/ui/use-toast";
import { useClientTFunction } from "@app/utils/i18n/utils/i18nHooks";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAccountFormSchema } from "@app/app/[lang]/(loggedIn)/account/_content/utils/accountFormSchema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@app/components/ui/card";
import { Form, FormProvider } from "@app/components/ui/form";
import { FormField } from "@app/components/ui/formField";
import { Input } from "@app/components/ui/input";
import { Button } from "@app/components/ui/button";
import { AccountFormState } from "@app/app/[lang]/(loggedIn)/account/_content/utils/accountFormTypes";
import { Tooltip, TooltipContent, TooltipTrigger } from "@app/components/ui/tooltip";
import { DropdownMenuSeparator } from "@app/components/ui/dropdown-menu";

type AccountFormProps = { user: { email: string; name: string } };

export const AccountForm = ({ user }: AccountFormProps) => {
    // --- STATE ---

    const { toast } = useToast();

    const t = useClientTFunction();

    const router = useRouter();

    const form = useForm<AccountFormState>({
        defaultValues: {
            email: user.email,
            name: user.name,
        },
        mode: "onBlur",
        resolver: zodResolver(getAccountFormSchema(t)),
    });

    // --- RENDER ---

    return (
        <Card className="max-w-[400px] w-full">
            <CardHeader>
                <CardTitle>{t("pages.account.title")}</CardTitle>

                <CardDescription>{t("pages.account.description")}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-2">
                <FormProvider {...form}>
                    <Form>
                        <Tooltip>
                            <TooltipContent>{t("pages.account.emailTooltip")}</TooltipContent>

                            <TooltipTrigger className="w-full text-left">
                                <FormField
                                    className="mb-5"
                                    control={form.control}
                                    label={t("pages.account.emailLabel")}
                                    name="email"
                                    disabled={true}
                                    input={Input}
                                />
                            </TooltipTrigger>
                        </Tooltip>

                        <FormField
                            className="mb-10"
                            control={form.control}
                            label={t("pages.account.nameLabel")}
                            placeholder={t("pages.account.namePlaceholder")}
                            name="name"
                            input={Input}
                        />

                        <DropdownMenuSeparator />

                        <FormField
                            className="mt-10 mb-5"
                            control={form.control}
                            label={t("pages.account.passwordLabel")}
                            placeholder={t("pages.account.passwordPlaceholder")}
                            name="password"
                            input={Input}
                        />

                        <FormField
                            control={form.control}
                            label={t("pages.account.passwordConfirmLabel")}
                            placeholder={t("pages.account.passwordConfirmPlaceholder")}
                            name="confirmPassword"
                            input={Input}
                        />

                        <Button disabled={!form.formState.isValid} className="mt-5">
                            {t("pages.account.button")}
                        </Button>
                    </Form>
                </FormProvider>
            </CardContent>
        </Card>
    );
};
