import type { Metadata } from "next"
import { Translations } from "@app/app/[lang]/(loggedIn)/translations/_content/translations"

export const metadata: Metadata = {
	title: "Translations",
}
import { getQueryClient } from "@app/utils/reactQuery/reactQueryHelpers"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { cookies } from "next/headers"
import { setSSRAuthCookie } from "@app/utils/api/apiRequests"
import { getTranslationsQueryOptions } from "@app/utils/reactQuery/queryOptions"

export default async function Page() {
	const cookieStore = await cookies()
	setSSRAuthCookie(cookieStore.get("auth-cookie")?.value)

	const queryClient = getQueryClient()

	void queryClient.prefetchQuery(
		getTranslationsQueryOptions({
			page: 1,
			pageSize: 1,
		}),
	)

	// --- RENDER ---

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Translations />
		</HydrationBoundary>
	)
}
