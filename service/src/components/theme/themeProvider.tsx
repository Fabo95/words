"use client";

// See: https://github.com/shadcn-ui/ui/issues/5552#issuecomment-2435053678
const NextThemesProvider = dynamic(() => import("next-themes").then((e) => e.ThemeProvider), {
    ssr: false,
});

import { type ThemeProviderProps } from "next-themes";
import dynamic from "next/dynamic";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
