"use client";

import { useParams } from "next/navigation";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@app/components/ui/card";
import { Label } from "@app/components/ui/label";
import { Input } from "@app/components/ui/input";
import { Button } from "@app/components/ui/button";
import { getTFunction } from "@app/utils/i18n/tFunction";
import { Locale } from "@app/utils/locale/localeTypes";

export const RegistrationCardContent = () => {
    // --- STATE ---

    const { lang } = useParams<Record<"lang", Locale>>();

    const t = getTFunction(lang);

    // --- RENDER ---

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("pages.authentication.registration.title")}</CardTitle>

                <CardDescription>{t("pages.authentication.registration.description")}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-2">
                <div className="space-y-1">
                    <Label htmlFor="email">{t("pages.authentication.login.labelOne")}</Label>

                    <Input
                        id="email"
                        placeholder={t("pages.authentication.registration.placeholderOne")}
                        type="email"
                    />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="password">{t("pages.authentication.registration.labelTwo")}</Label>

                    <Input id="password" type="password" />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="repeat-password">{t("pages.authentication.registration.labelThree")}</Label>

                    <Input id="repeat-password" type="password" />
                </div>
            </CardContent>

            <CardFooter>
                <Button>{t("pages.authentication.registration.submit")}</Button>
            </CardFooter>
        </Card>
    );
};
