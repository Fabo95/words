"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@app/components/ui/card";
import { Input } from "@app/components/ui/input";
import { Button } from "@app/components/ui/button";
import { getTFunction } from "@app/lib/i18n/tFunction";
import { useParams } from "next/navigation";
import { Locale } from "@app/lib/locale/localeTypes";
import { useForm } from "react-hook-form";
import { LoginFormState } from "@app/block/authentication/loginCardContent/utils/loginCardContentTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { getLoginFormSchema } from "@app/block/authentication/loginCardContent/utils/loginCardContentSchema";
import { InputWrapper } from "@app/components/ui/inputWrapper";

export const LoginCardContent = () => {
    // --- STATE ---

    const { lang } = useParams<Record<"lang", Locale>>();

    const t = getTFunction(lang);

    const {
        register,
        formState: { errors },
    } = useForm<LoginFormState>({
        defaultValues: {
            email: "",
            password: "",
        },
        resolver: zodResolver(getLoginFormSchema(t)),
        mode: "onBlur",
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
                    name="email"
                    label={t("pages.authentication.login.labelOne")}
                    errorMessage={errors.email?.message}
                >
                    <Input
                        id="email"
                        type="email"
                        placeholder={t("pages.authentication.login.placeholderOne")}
                        {...register("email")}
                    />
                </InputWrapper>

                <InputWrapper
                    name="password"
                    label={t("pages.authentication.login.labelTwo")}
                    errorMessage={errors.password?.message}
                >
                    <Input type="password" id="password" {...register("password")} />
                </InputWrapper>
            </CardContent>

            <CardFooter>
                <Button>{t("pages.authentication.login.submit")}</Button>
            </CardFooter>
        </Card>
    );
};
