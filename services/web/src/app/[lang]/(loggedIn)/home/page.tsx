import type { Metadata } from "next"
import { Greeting } from "@app/app/[lang]/(loggedIn)/home/_content/greeting"

export const metadata: Metadata = {
	title: "Home",
}
import { Suspense } from "react"
import { GreetingFallback } from "@app/app/[lang]/(loggedIn)/home/_content/greetingFallback"
import { getQueryClient } from "@app/utils/reactQuery/reactQueryHelpers"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { cookies } from "next/headers"
import { setSSRAuthCookie } from "@app/utils/api/apiRequests"
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

export default async function Page() {
	const cookieStore = await cookies()
	setSSRAuthCookie(cookieStore.get("auth-cookie")?.value)

	const queryClient = getQueryClient()

	await Promise.all([
		queryClient.prefetchQuery(getLatestTranslationsQueryOptions()),
		queryClient.prefetchQuery(getTranslationStatisticsQueryOptions()),
		queryClient.prefetchQuery(getDailyStatisticsQueryOptions({ days: 7 })),
	])

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
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
		</HydrationBoundary>
	)
}
