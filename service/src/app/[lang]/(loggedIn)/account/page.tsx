import { cookies } from "next/headers";

import { apiGetUser } from "@app/utils/api/apiRequests";
import { AccountNameForm } from "@app/app/[lang]/(loggedIn)/account/_content/accountNameForm/accountNameForm";
import { Box } from "@app/components/ui/box";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@app/components/ui/tabs";
import { getTFunction } from "@app/utils/i18n/utils/i18nHelpers";
import { ReactNode } from "react";
import { Locale } from "@app/utils/locale/localeTypes";
import { AccountPasswordForm } from "@app/app/[lang]/(loggedIn)/account/_content/accountPasswordForm/accountPasswordForm";

export default async function ({ params }: { params: Promise<Record<"lang", Locale>> }) {
    // --- STATE ---

    const cookieStore = await cookies();

    const authCookieValue = cookieStore.get("auth-cookie")?.value;

    const user = await apiGetUser(authCookieValue);

    const { lang } = await params;

    const t = getTFunction(lang);

    console.log("user", user);

    // --- RENDER ---

    return (
        <Box className="justify-center pt-16 items-center">
            <Tabs defaultValue="name" className="max-w-[400px] w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="name">{t("pages.account.name.title")}</TabsTrigger>

                    <TabsTrigger value="password">{t("pages.account.password.title")}</TabsTrigger>
                </TabsList>

                <TabsContent value="name">
                    <AccountNameForm user={user} />
                </TabsContent>

                <TabsContent value="password">
                    <AccountPasswordForm />
                </TabsContent>
            </Tabs>
        </Box>
    );
}
