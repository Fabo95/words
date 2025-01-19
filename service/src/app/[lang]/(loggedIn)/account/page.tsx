import { cookies } from "next/headers";

import { apiGetUser } from "@app/utils/api/apiRequests";

export default async function () {
    // --- STATE ---

    const cookieStore = await cookies();

    const authCookieValue = cookieStore.get("auth-cookie")?.value;

    const user = await apiGetUser(authCookieValue);

    // --- RENDER ---

    return null;
}
