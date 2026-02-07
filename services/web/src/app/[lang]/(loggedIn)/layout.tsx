import { cookies } from "next/headers"
import { ReactNode, Suspense } from "react"

import { AppSidebar } from "@app/components/appSidebar/appSidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@app/components/ui/sidebar"
import { getQueryClient } from "@app/utils/reactQuery/reactQueryHelpers"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { AddTranslationTrigger } from "@app/app/[lang]/(loggedIn)/_content/addTranslationTrigger"
import { PageContent } from "@app/components/ui/pageContent"
import { Skeleton } from "@app/components/ui/skeleton"
import * as React from "react"
import {
	getCefrLevelsQueryOptions,
	getCollectionsQueryOptions,
	getUniversalPosTagsQueryOptions,
	getUserQueryOptions,
} from "@app/utils/reactQuery/queryOptions"

export default async function Layout({ children }: { children: ReactNode }) {
	// --- STATE ---

	const cookieStore = await cookies()
	const defaultOpen = cookieStore.get("sidebar:state")?.value === "true"
	const authCookieValue = cookieStore.get("auth-cookie")?.value

	const queryClient = getQueryClient()

	// Prefetching and de/hydrating data
	// - const queryClient = getQueryClient() in Server Component
	// - await queryClient.prefetchQuery in Server Component
	// - add HydrationBoundary state={dehydrate(queryClient)} in Server Component
	// - on the client use useQuery and data will be available immediately
	//    - Note that we are using useQuery here instead of useSuspenseQuery.
	//      Because this data has already been prefetched (because its awaited), there is no need to
	//      ever suspend in the component itself.
	// See: https://tanstack.com/query/v5/docs/framework/react/guides/advanced-ssr#prefetching-and-dehydrating-data

	// Streaming with Server Components
	// As of React Query v5.40.0, you don't have to await all prefetches for this to work, as pending Queries can also be dehydrated and sent to the client. This lets you kick off prefetches as early as possible without letting them block an entire Suspense boundary, and streams the data to the client as the query finishes.
	// Make this work:
	// - instruct the queryClient to also dehydrate pending Queries (see makeQueryClient)
	// - const queryClient = getQueryClient() in Server Component
	// - don't await queryClient.prefetchQuery in Server Component
	// - add HydrationBoundary state={dehydrate(queryClient)} in Server Component
	// - on the client use useSuspenseQuery and the component will suspend util the Promise is resolved.
	//     - Note that we are using useSuspenseQuery instead of useQuery.
	//       you could also useQuery instead of useSuspenseQuery, and the Promise would still be picked up correctly.
	//       However, NextJs won't suspend in that case and the component will render in the pending status, which also opts out of server rendering the content.
	// See: https://tanstack.com/query/v5/docs/framework/react/guides/advanced-ssr#streaming-with-server-components
	void queryClient.prefetchQuery(getUserQueryOptions(authCookieValue))

	void queryClient.prefetchQuery(getCollectionsQueryOptions(authCookieValue))

	void queryClient.prefetchQuery(getCefrLevelsQueryOptions(authCookieValue))

	void queryClient.prefetchQuery(getUniversalPosTagsQueryOptions(authCookieValue))

	// --- RENDER ---

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<SidebarProvider defaultOpen={defaultOpen}>
				<AppSidebar />

				<SidebarInset>
					<nav className="bg-black flex justify-between sticky top-0 p-3 md:p-5 border-b z-50 w-full">
						<SidebarTrigger className="h-9 w-9 md:h-7 md:w-7" />

						<Suspense fallback={<Skeleton className="h-9 w-9 md:h-7 md:w-7" />}>
							<AddTranslationTrigger
								variant="ghost"
								className="h-9 w-9 md:h-7 md:w-7"
								size="icon"
								defaultValues={{ universalPosTagIds: [] }}
							/>
						</Suspense>
					</nav>

					<PageContent>{children}</PageContent>
				</SidebarInset>
			</SidebarProvider>
		</HydrationBoundary>
	)
}
