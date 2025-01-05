import { ReactNode } from "react";
import "@app/styles/globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { cn } from "@app/lib/shadcn/shadcnHelpers";
import { Toaster } from "@app/components/ui/toaster";
import { ThemeProvider } from "@app/components/themeProvider";
import { ModeToggle } from "@app/components/modeToggle";
import { Row } from "@app/components/ui/row";
import { Box } from "@app/components/ui/box";

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
                <ThemeProvider disableTransitionOnChange enableSystem attribute="class" defaultTheme="system">
                    <Box className="p-5 h-screen">
                        <Row className="w-full ">
                        <ModeToggle />
                      </Row>

                        {children}
              </Box>

                <Toaster />
                </ThemeProvider>
          </body>
      </html>
    );
}
