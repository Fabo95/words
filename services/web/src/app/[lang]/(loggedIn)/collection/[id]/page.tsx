import { CollectionTable } from "@app/app/[lang]/(loggedIn)/collection/[id]/_content/collection/collectionTable"
import { Locale } from "@app/utils/locale/localeTypes"
import { getQueryClient } from "@app/utils/reactQuery/reactQueryHelpers"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { cookies } from "next/headers"
import {
	getCollectionByIdQueryOptions,
	getCollectionTranslationsQueryOptions,
} from "@app/utils/reactQuery/queryOptions"

export default async function Page({
	params,
	searchParams,
}: { params: Promise<{ lang: Locale; id: string }>; searchParams: Promise<{ page?: string; search?: string }> }) {
	// --- STATE ---

	const cookieStore = await cookies()
	const authCookieValue = cookieStore.get("auth-cookie")?.value

	const { id } = await params
	const { page, search } = await searchParams

	const queryClient = getQueryClient()

	void queryClient.prefetchQuery(getCollectionByIdQueryOptions(Number(id), authCookieValue))

	void queryClient.prefetchQuery(
		getCollectionTranslationsQueryOptions({
			id: Number(id),
			page: Number(page) ?? 1,
			search: search ?? undefined,
			pageSize: 20,
			authCookieValue,
		}),
	)

	// --- RENDER ---

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<CollectionTable />
		</HydrationBoundary>
	)
}
