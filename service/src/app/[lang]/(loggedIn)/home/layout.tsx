import { ReactNode } from "react";
import { cookies } from "next/headers";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@app/components/ui/sidebar";
import { AppSidebar } from "@app/components/composed/app-sidebar";

export default async function Layout({ children }: { children: ReactNode }) {
    // --- STATE ---

    const cookieStore = await cookies();
    const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

    // --- RENDER ---

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />

            <SidebarInset>
                <main>
                    <SidebarTrigger />
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
