import { Greeting } from "@app/app/[lang]/(loggedIn)/home/_content/greeting"
import { Suspense } from "react"
import { GreetingFallback } from "@app/app/[lang]/(loggedIn)/home/_content/greetingFallback"
import { $api } from "@app/utils/api/apiRequests"
import { getQueryClient } from "@app/utils/reactQuery/reactQueryHelpers"
import { cookies } from "next/headers"
import { LastAddedTranslation } from "@app/app/[lang]/(loggedIn)/home/_content/lastAddedTranslation"
import { LastAddedTranslationFallback } from "@app/app/[lang]/(loggedIn)/home/_content/lastAddedTranslationFallback"

export default async function () {
	const cookieStore = await cookies()
	const authCookieValue = cookieStore.get("auth-cookie")?.value

	const queryClient = getQueryClient()

	void queryClient.prefetchQuery(
		$api.queryOptions("get", "/translation", {
			params: {
				query: {
					page_size: 1,
					sort_by: "created_at",
					sort_order: "desc",
				},
			},
			headers: { Cookie: `auth-cookie=${authCookieValue}` },
		}),
	)

	return (
		<>
			<Suspense fallback={<GreetingFallback />}>
				<Greeting />
			</Suspense>

			<Suspense fallback={<LastAddedTranslationFallback />}>
				<LastAddedTranslation />
			</Suspense>
		</>
	)
}
