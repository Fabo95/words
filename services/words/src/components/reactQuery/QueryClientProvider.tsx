"use client"

// Since QueryClientProvider relies on useContext under the hood, we have to put 'use client' on top
import { QueryClientProvider as ReactQueryClientProvider } from "@tanstack/react-query"
import { getQueryClient } from "services/words/src/utils/reactQuery/reactQueryHelpers"

// See: https://tanstack.com/query/v5/docs/framework/react/guides/advanced-ssr#initial-setup
export function QueryClientProvider({ children }: { children: React.ReactNode }) {
	// NOTE: Avoid useState when initializing the query client if you don't
	//       have a suspense boundary between this and the code that may
	//       suspend because React will throw away the client on the initial
	//       render if it suspends and there is no boundary
	const queryClient = getQueryClient()

	return <ReactQueryClientProvider client={queryClient}>{children}</ReactQueryClientProvider>
}
