"use client";

import { ReactNode } from "react";
import { QueryClientProvider as ReactQueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@app/utils/reactQuery/queryClient";

export const QueryClientProvider = ({ children }: { children: ReactNode }) => {
    // --- RENDER ---

    return <ReactQueryClientProvider client={queryClient}>{children}</ReactQueryClientProvider>;
};
