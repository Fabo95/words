import { ReactNode } from "react";
import { cookies } from "next/headers";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@app/components/ui/sidebar";
import { AppSidebar } from "@app/components/appSidebar/appSidebar";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { apiGetUser } from "@app/utils/api/apiRequests";

export default async function Layout({ children }: { children: ReactNode }) {
    // --- STATE ---

    const cookieStore = await cookies();
    const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";
    const authCookieValue = cookieStore.get("auth-cookie")?.value;

    const queryClient = new QueryClient();

    // See: https://tanstack.com/query/v5/docs/framework/react/guides/advanced-ssr#prefetching-and-dehydrating-data
    await queryClient.prefetchQuery({ queryKey: ["apiGetUser"], queryFn: () => apiGetUser(authCookieValue), retry: 3 });

    // --- RENDER ---

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <SidebarProvider defaultOpen={defaultOpen}>
                <AppSidebar />

                <SidebarInset>
                    <SidebarTrigger />

                    {children}
                </SidebarInset>
            </SidebarProvider>
        </HydrationBoundary>
    );
}
