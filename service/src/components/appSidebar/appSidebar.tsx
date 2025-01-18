"use client";

import * as React from "react";
import { BookOpen, Bot, Frame, Languages, Map, PieChart, Settings2, SquareTerminal } from "lucide-react";

import { NavMain } from "@app/components/appSidebar/nav-main";
import { NavProjects } from "@app/components/appSidebar/nav-projects";
import { UserActions } from "@app/components/appSidebar/userActions";
import { LanguageSwitcher } from "@app/components/appSidebar/languageSwitcher";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@app/components/ui/sidebar";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { Locale } from "@app/utils/locale/localeTypes";
import { getTFunction } from "@app/utils/i18n/tFunction";

// This is sample data.
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },

    navMain: [
        {
            title: "Playground",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "History",
                    url: "#",
                },
                {
                    title: "Starred",
                    url: "#",
                },
                {
                    title: "Settings",
                    url: "#",
                },
            ],
        },
        {
            title: "Models",
            url: "#",
            icon: Bot,
            items: [
                {
                    title: "Genesis",
                    url: "#",
                },
                {
                    title: "Explorer",
                    url: "#",
                },
                {
                    title: "Quantum",
                    url: "#",
                },
            ],
        },
        {
            title: "Documentation",
            url: "#",
            icon: BookOpen,
            items: [
                {
                    title: "Introduction",
                    url: "#",
                },
                {
                    title: "Get Started",
                    url: "#",
                },
                {
                    title: "Tutorials",
                    url: "#",
                },
                {
                    title: "Changelog",
                    url: "#",
                },
            ],
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "General",
                    url: "#",
                },
                {
                    title: "Team",
                    url: "#",
                },
                {
                    title: "Billing",
                    url: "#",
                },
                {
                    title: "Limits",
                    url: "#",
                },
            ],
        },
    ],
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: Frame,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: PieChart,
        },
        {
            name: "Travel",
            url: "#",
            icon: Map,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    // --- STATE ---

    const { lang } = useParams<Record<"lang", Locale>>();

    const t = getTFunction(lang);

    // --- MEMOIZED DATA ---

    // Fetch it later from db.
    const LANGUAGES = useMemo(
        () => [
            {
                name: t("components.languageSwitcher.dropdownOptionLabel"),
                logo: Languages,
                description: t("components.languageSwitcher.dropdownOptionDescription"),
            },
        ],
        [t]
    );

    // --- RENDER ---

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <LanguageSwitcher languages={LANGUAGES} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavProjects projects={data.projects} />
            </SidebarContent>
            <SidebarFooter>
                <UserActions />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
