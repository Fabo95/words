"use client";

import { BadgeCheck, LogOut, Sparkles } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@app/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@app/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@app/components/ui/sidebar";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { apiGetUser, apiPostUserLogout } from "@app/utils/api/apiRequests";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Page } from "@app/utils/routing/routingTypes";
import { useClientTFunction } from "@app/utils/i18n/utils/i18nHooks";
import { useCallback } from "react";

export function UserActions() {
    // --- STATE ---

    const { isMobile } = useSidebar();

    const t = useClientTFunction();

    const queryClient = useQueryClient();

    const router = useRouter();

    const { data: userData } = useSuspenseQuery({ queryKey: ["apiGetUser"], queryFn: () => apiGetUser() });

    const { mutate: mutateUserLogout } = useMutation({
        mutationFn: apiPostUserLogout,
        onSuccess: () => {
            router.push(`/${Page.AUTHENTICATION}`);
            queryClient.invalidateQueries();
        },
    });

    console.log("userdata", userData);

    // --- CALLBACKS ---

    const handleToAccountClick = useCallback(() => {
        router.push(`/${Page.ACCOUNT}`);
    }, []);

    // --- RENDER ---

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src="/avatars/shadcn.jpg" alt={userData?.name} />
                                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{userData?.name ?? "-"}</span>
                                <span className="truncate text-xs">{userData?.email ?? "-"}</span>
                            </div>
                            <CaretSortIcon className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src="/avatars/shadcn.jpg" alt={userData?.name} />
                                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{userData?.name ?? "-"}</span>
                                    <span className="truncate text-xs">{userData?.email ?? "-"}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Sparkles />
                                Upgrade to Pro
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={handleToAccountClick}>
                                <BadgeCheck />
                                {t("components.userActions.account")}
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => mutateUserLogout()}>
                            <LogOut />
                            {t("components.userActions.logout")}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
