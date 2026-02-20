import { ReactNode } from "react"

import { getQueryClient } from "@app/utils/reactQuery/reactQueryHelpers"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { PageContent } from "@app/components/ui/pageContent"

export default async function Layout({ children }: { children: ReactNode }) {
	// --- STATE ---

	const queryClient = getQueryClient()

	// --- RENDER ---

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<PageContent className="min-h-dvh">{children}</PageContent>
		</HydrationBoundary>
	)
}
