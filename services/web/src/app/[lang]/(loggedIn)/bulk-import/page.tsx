import type { Metadata } from "next"
import { BulkImport } from "@app/app/[lang]/(loggedIn)/bulk-import/_content/bulkImport"
import { getQueryClient } from "@app/utils/reactQuery/reactQueryHelpers"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { cookies } from "next/headers"
import { setSSRAuthCookie } from "@app/utils/api/apiRequests"
import { getCollectionsQueryOptions } from "@app/utils/reactQuery/queryOptions"

export const metadata: Metadata = {
	title: "Import Vocabulary",
}

export default async function Page() {
	const cookieStore = await cookies()
	setSSRAuthCookie(cookieStore.get("auth-cookie")?.value)

	const queryClient = getQueryClient()

	void queryClient.prefetchQuery(getCollectionsQueryOptions())

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<BulkImport />
		</HydrationBoundary>
	)
}
