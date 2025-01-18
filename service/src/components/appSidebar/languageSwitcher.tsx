"use client";

import * as React from "react";
import { useParams } from "next/navigation";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@app/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@app/components/ui/sidebar";
import { CaretSortIcon, PlusIcon } from "@radix-ui/react-icons";
import { getTFunction } from "@app/utils/i18n/tFunction";
import { Locale } from "@app/utils/locale/localeTypes";
import { Tooltip, TooltipContent, TooltipTrigger } from "@app/components/ui/tooltip";

export type LanguageSwitchProps = {
    languages: {
        name: string;
        logo: React.ElementType;
        description: string;
    }[];
};
export function LanguageSwitcher({ languages }: LanguageSwitchProps) {
    // --- STATE ---

    const { lang } = useParams<Record<"lang", Locale>>();

    const [activeLanguage, setActiveLanguage] = React.useState(languages[0]);

    const t = getTFunction(lang);

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
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                <activeLanguage.logo className="size-4" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{activeLanguage.name}</span>
                                <span className="truncate text-xs">{activeLanguage.description}</span>
                            </div>
                            <CaretSortIcon className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        align="start"
                        side="bottom"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                            {t("components.languageSwitcher.dropdownLabel")}
                        </DropdownMenuLabel>
                        {languages.map((language) => (
                            <DropdownMenuItem
                                key={language.name}
                                onClick={() => setActiveLanguage(language)}
                                className="gap-2 p-2"
                            >
                                <div className="flex size-6 items-center justify-center rounded-sm border">
                                    <language.logo className="size-4 shrink-0" />
                                </div>
                                {language.name}
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <Tooltip>
                            <TooltipContent>{t("components.languageSwitcher.dropdownTooltipFeature")}</TooltipContent>

                            <TooltipTrigger>
                                <DropdownMenuItem disabled={true} className="gap-2 p-2">
                                    <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                        <PlusIcon className="size-4" />
                                    </div>
                                    <div className="font-medium text-muted-foreground">
                                        {t("components.languageSwitcher.dropdownAddButton")}
                                    </div>
                                </DropdownMenuItem>
                            </TooltipTrigger>
                        </Tooltip>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
