import { ReactNode } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@app/components/ui/tabs";
import { Locale } from "@app/utils/locale/localeTypes";
import { LoginCardForm } from "@app/app/[lang]/(loggedOut)/authentication/_content/loginCardContent/loginCardForm";
import { RegistrationCardForm } from "@app/app/[lang]/(loggedOut)/authentication/_content/registrationCardForm/registrationCardForm";
import { Box } from "@app/components/ui/box";
import { getTFunction } from "@app/utils/i18n/utils/i18nHelpers";

export default async function Authentication({
    params,
}: {
    children: ReactNode;
    params: Promise<Record<"lang", Locale>>;
}) {
    // --- STATE ---

    const { lang } = await params;

    const t = getTFunction(lang);

    // --- RENDER ---

    return (
        <Box className="justify-center pt-16 items-center">
            <Tabs defaultValue="login" className="max-w-[400px] w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">{t("pages.authentication.login.title")}</TabsTrigger>

                    <TabsTrigger value="register">{t("pages.authentication.registration.title")}</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                    <LoginCardForm />
                </TabsContent>

                <TabsContent value="register">
                    <RegistrationCardForm />
                </TabsContent>
            </Tabs>
        </Box>
    );
}
