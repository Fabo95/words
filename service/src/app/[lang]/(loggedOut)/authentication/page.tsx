import { ReactNode } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@app/components/ui/tabs";
import { getTFunction } from "@app/lib/i18n/tFunction";
import { Locale } from "@app/lib/locale/localeTypes";
import { LoginCardContent } from "@app/block/authentication/loginCardContent/loginCardContent";
import { RegistrationCardContent } from "@app/block/authentication/registrationCardContent";
import { Box } from "@app/components/ui/box";

export default function Authentication({ params: { lang } }: { children: ReactNode; params: Record<string, Locale> }) {
    // --- STATE ---

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
                    <LoginCardContent />
                </TabsContent>

                <TabsContent value="register">
                    <RegistrationCardContent />
                </TabsContent>
            </Tabs>
        </Box>
    );
}
