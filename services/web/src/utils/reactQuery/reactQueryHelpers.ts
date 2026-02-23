import { QueryClient, defaultShouldDehydrateQuery, isServer } from "@tanstack/react-query"
import { cache } from "react"

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 5 * 60 * 1000,
				refetchOnWindowFocus: false,
			},
			dehydrate: {
				shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === "pending",
				shouldRedactErrors: () => false,
			},
		},
	})
}

// Use React cache() to share queryClient per server request
// This ensures layout and page prefetches go into the same client
const getServerQueryClient = cache(makeQueryClient)

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
	if (isServer) {
		return getServerQueryClient()
	}
	if (!browserQueryClient) browserQueryClient = makeQueryClient()
	return browserQueryClient
}
