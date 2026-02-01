import { Learning } from "@app/app/[lang]/(loggedIn)/learning/_content/learning"
import { getQueryClient } from "@app/utils/reactQuery/reactQueryHelpers"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { cookies } from "next/headers"
import { getLearnStatsQueryOptions } from "@app/utils/reactQuery/queryOptions"

export default async function Page() {
	const cookieStore = await cookies()
	const authCookieValue = cookieStore.get("auth-cookie")?.value

	const queryClient = getQueryClient()

	void queryClient.prefetchQuery(getLearnStatsQueryOptions(authCookieValue))

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Learning />
		</HydrationBoundary>
	)
}
