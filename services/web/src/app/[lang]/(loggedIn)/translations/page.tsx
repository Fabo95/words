import { Translations } from "@app/app/[lang]/(loggedIn)/translations/_content/translations"
import { Locale } from "@app/utils/locale/localeTypes"
import { getQueryClient } from "@app/utils/reactQuery/reactQueryHelpers"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { cookies } from "next/headers"
import { getTranslationsQueryOptions } from "@app/utils/reactQuery/queryOptions"

export default async function Page({
	searchParams,
}: { params: Promise<{ lang: Locale }>; searchParams: Promise<{ page?: string; search?: string }> }) {
	// --- STATE ---

	const cookieStore = await cookies()
	const authCookieValue = cookieStore.get("auth-cookie")?.value

	const queryClient = getQueryClient()

	// This is to check if translations exist.
	void queryClient.prefetchQuery(
		getTranslationsQueryOptions({
			page: 1,
			pageSize: 1,
			authCookieValue,
		}),
	)

	// --- RENDER ---

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Translations />
		</HydrationBoundary>
	)
}
