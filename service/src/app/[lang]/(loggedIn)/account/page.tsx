import { cookies } from "next/headers";

import { apiGetUser } from "@app/utils/api/apiRequests";
import { AccountForm } from "@app/app/[lang]/(loggedIn)/account/_content/accountForm";
import { Box } from "@app/components/ui/box";

export default async function () {
    // --- STATE ---

    const cookieStore = await cookies();

    const authCookieValue = cookieStore.get("auth-cookie")?.value;

    const user = await apiGetUser(authCookieValue);

    console.log("user", user);

    // --- RENDER ---

    return (
        <Box className="justify-center pt-16 items-center">
            <AccountForm user={user} />
        </Box>
    );
}
