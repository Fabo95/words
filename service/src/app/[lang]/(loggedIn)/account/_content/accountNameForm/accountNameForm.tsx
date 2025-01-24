"use client";

import * as React from "react";

import { useToast } from "@app/components/ui/use-toast";
import { useClientTFunction } from "@app/utils/i18n/utils/i18nHooks";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAccountNameFormSchema } from "@app/app/[lang]/(loggedIn)/account/_content/accountNameForm/utils/accountNameFormSchema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@app/components/ui/card";
import { Form, FormProvider } from "@app/components/ui/form";
import { FormField } from "@app/components/ui/formField";
import { Input } from "@app/components/ui/input";
import { Button } from "@app/components/ui/button";
import { AccountNameFormState } from "@app/app/[lang]/(loggedIn)/account/_content/accountNameForm/utils/accountNameFormTypes";
import { Tooltip, TooltipContent, TooltipTrigger } from "@app/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { apiGetUser } from "@app/utils/api/apiRequests";

export const AccountNameForm = () => {
    // --- STATE ---

    const { data: userData } = useQuery({ queryKey: ["apiGetUser"], queryFn: () => apiGetUser() });

    console.log("123userData", userData);

    const { toast } = useToast();

    const t = useClientTFunction();

    const router = useRouter();

    const form = useForm<AccountNameFormState>({
        defaultValues: {
            email: userData.email,
            name: userData.name,
        },
        mode: "onBlur",
        resolver: zodResolver(getAccountNameFormSchema(t)),
    });

    // --- RENDER ---

    return (
        <Card className="max-w-[400px] w-full">
            <CardHeader>
                <CardTitle>{t("pages.account.name.title")}</CardTitle>

                <CardDescription>{t("pages.account.name.description")}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-2">
                <FormProvider {...form}>
                    <Form>
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

                        <Button disabled={!form.formState.isValid} className="mt-5">
                            {t("pages.account.name.button")}
                        </Button>
                    </Form>
                </FormProvider>
            </CardContent>
        </Card>
    );
};
