import { Greeting } from "@app/app/[lang]/(loggedIn)/home/_content/greeting"
import { Suspense } from "react"
import { GreetingFallback } from "@app/app/[lang]/(loggedIn)/home/_content/greetingFallback"
import { getQueryClient } from "@app/utils/reactQuery/reactQueryHelpers"
import { cookies } from "next/headers"
import { LastAddedTranslation } from "@app/app/[lang]/(loggedIn)/home/_content/lastAddedTranslation"
import { LastAddedTranslationFallback } from "@app/app/[lang]/(loggedIn)/home/_content/lastAddedTranslationFallback"
import { getLatestTranslationsQueryOptions } from "@app/utils/reactQuery/queryOptions"

export default async function () {
	const cookieStore = await cookies()
	const authCookieValue = cookieStore.get("auth-cookie")?.value

	const queryClient = getQueryClient()

	void queryClient.prefetchQuery(getLatestTranslationsQueryOptions(authCookieValue))

	return (
		<div className="mx-auto w-full max-w-lg">
			<Suspense fallback={<GreetingFallback />}>
				<Greeting />
			</Suspense>

			<div className="my-10 w-full flex justify-center">
				<div className="h-px w-full bg-border/40" />
			</div>

			<Suspense fallback={<LastAddedTranslationFallback />}>
				<LastAddedTranslation />
			</Suspense>
		</div>
	)
}
