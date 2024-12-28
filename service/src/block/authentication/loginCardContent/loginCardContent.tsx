"use client";

import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@app/components/ui/card";
import { Input } from "@app/components/ui/input";
import { Button } from "@app/components/ui/button";
import { getTFunction } from "@app/lib/i18n/tFunction";
import { Locale } from "@app/lib/locale/localeTypes";
import { LoginFormState } from "@app/block/authentication/loginCardContent/utils/loginCardContentTypes";
import { getLoginFormSchema } from "@app/block/authentication/loginCardContent/utils/loginCardContentSchema";
import { InputWrapper } from "@app/components/ui/inputWrapper";

export const LoginCardContent = () => {
    // --- STATE ---

    const { lang } = useParams<Record<"lang", Locale>>();

    const t = getTFunction(lang);

    const {
        formState: { errors },
        register,
    } = useForm<LoginFormState>({
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onBlur",
        resolver: zodResolver(getLoginFormSchema(t)),
    });

    // --- RENDER ---

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("pages.authentication.login.title")}</CardTitle>

                <CardDescription>{t("pages.authentication.login.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <InputWrapper
                    className="mb-5"
                    errorMessage={errors.email?.message}
                    label={t("pages.authentication.login.labelOne")}
                    name="email"
                >
                    <Input
                        id="email"
                        placeholder={t("pages.authentication.login.placeholderOne")}
                        type="email"
                        {...register("email")}
                    />
                </InputWrapper>

                <InputWrapper
                    errorMessage={errors.password?.message}
                    label={t("pages.authentication.login.labelTwo")}
                    name="password"
                >
                    <Input id="password" type="password" {...register("password")} />
                </InputWrapper>
            </CardContent>

            <CardFooter>
                <Button>{t("pages.authentication.login.submit")}</Button>
            </CardFooter>
        </Card>
    );
};
