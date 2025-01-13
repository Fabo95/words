import { ReactNode } from "react";
import { cookies } from "next/headers";

import { SidebarProvider, SidebarTrigger } from "@app/components/ui/sidebar";
import { AppSidebar } from "@app/components/ui/app-sidebar";

export default async function Layout({ children }: { children: ReactNode }) {
    // --- STATE ---

    const cookieStore = await cookies();
    const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

    // --- RENDER ---

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <main>
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    );
}
