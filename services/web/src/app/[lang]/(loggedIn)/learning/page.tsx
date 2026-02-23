import type { Metadata } from "next"
import { Learning } from "@app/app/[lang]/(loggedIn)/learning/_content/learning"

export const metadata: Metadata = {
	title: "Learn",
}
import { getQueryClient } from "@app/utils/reactQuery/reactQueryHelpers"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { cookies } from "next/headers"
import { setSSRAuthCookie } from "@app/utils/api/apiRequests"
import { getLearnStatsQueryOptions, getCollectionsQueryOptions } from "@app/utils/reactQuery/queryOptions"

export default async function Page() {
	const cookieStore = await cookies()
	setSSRAuthCookie(cookieStore.get("auth-cookie")?.value)

	const queryClient = getQueryClient()

	void queryClient.prefetchQuery(getLearnStatsQueryOptions())
	void queryClient.prefetchQuery(getCollectionsQueryOptions())

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Learning />
		</HydrationBoundary>
	)
}
