import { CollectionTranslations } from "@app/app/[lang]/(loggedIn)/collection/[id]/_content/collection/collectionTranslations"
import { Locale } from "@app/utils/locale/localeTypes"
import { getQueryClient } from "@app/utils/reactQuery/reactQueryHelpers"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { cookies } from "next/headers"
import { setSSRAuthCookie } from "@app/utils/api/apiRequests"
import {
	getCollectionByIdQueryOptions,
	getCollectionTranslationsQueryOptions,
} from "@app/utils/reactQuery/queryOptions"

export default async function Page({
	params,
}: { params: Promise<{ lang: Locale; id: string }> }) {
	const cookieStore = await cookies()
	setSSRAuthCookie(cookieStore.get("auth-cookie")?.value)

	const { id } = await params

	const queryClient = getQueryClient()

	void queryClient.prefetchQuery(getCollectionByIdQueryOptions(Number(id)))
	void queryClient.prefetchQuery(
		getCollectionTranslationsQueryOptions({
			id: Number(id),
			page: 1,
			pageSize: 1,
		}),
	)

	// --- RENDER ---

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<CollectionTranslations />
		</HydrationBoundary>
	)
}
