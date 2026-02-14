import { Greeting } from "@app/app/[lang]/(loggedIn)/home/_content/greeting"
import { Suspense } from "react"
import { GreetingFallback } from "@app/app/[lang]/(loggedIn)/home/_content/greetingFallback"
import { getQueryClient } from "@app/utils/reactQuery/reactQueryHelpers"
import { cookies } from "next/headers"
import { LastAddedTranslation } from "@app/app/[lang]/(loggedIn)/home/_content/lastAddedTranslation"
import { LastAddedTranslationFallback } from "@app/app/[lang]/(loggedIn)/home/_content/lastAddedTranslationFallback"
import { Statistics } from "@app/app/[lang]/(loggedIn)/home/_content/statistics"
import { StatisticsFallback } from "@app/app/[lang]/(loggedIn)/home/_content/statisticsFallback"
import { ProgressChart } from "@app/app/[lang]/(loggedIn)/home/_content/progressChart"
import { ProgressChartFallback } from "@app/app/[lang]/(loggedIn)/home/_content/progressChartFallback"
import {
	getLatestTranslationsQueryOptions,
	getTranslationStatisticsQueryOptions,
	getDailyStatisticsQueryOptions,
} from "@app/utils/reactQuery/queryOptions"

export default async function () {
	const cookieStore = await cookies()
	const authCookieValue = cookieStore.get("auth-cookie")?.value

	const queryClient = getQueryClient()

	void queryClient.prefetchQuery(getLatestTranslationsQueryOptions(authCookieValue))
	void queryClient.prefetchQuery(getTranslationStatisticsQueryOptions(authCookieValue))
	void queryClient.prefetchQuery(getDailyStatisticsQueryOptions({ days: 7, authCookieValue }))

	return (
		<div className="mx-auto w-full max-w-lg">
			<Suspense fallback={<GreetingFallback />}>
				<Greeting />
			</Suspense>

			<Suspense fallback={<LastAddedTranslationFallback />}>
				<LastAddedTranslation />
			</Suspense>

			<Suspense fallback={<StatisticsFallback />}>
				<Statistics />
			</Suspense>

			<Suspense fallback={<ProgressChartFallback />}>
				<ProgressChart />
			</Suspense>
		</div>
	)
}
