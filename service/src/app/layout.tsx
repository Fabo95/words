import { ReactNode } from "react";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@app/styles/globals.css";
import { cn } from "@app/lib/shadcn/shadcnHelpers";
import { Toaster } from "@app/components/ui/toaster";

const interFont = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
});

export const metadata: Metadata = {
    description: "Generated by create next app",
    title: "Create Next App",
};

type RootLayoutProps = { children: ReactNode };

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en">
            <body className={cn("min-h-screen bg-background font-sans antialiased", interFont.variable)}>
                {children}

                <Toaster />
            </body>
        </html>
    );
}
