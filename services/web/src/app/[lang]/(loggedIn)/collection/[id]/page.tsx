import { CollectionTable } from "@app/app/[lang]/(loggedIn)/collection/[id]/_content/collectionTable/collectionTable"
import { $api } from "@app/utils/api/apiRequests"
import { Locale } from "@app/utils/locale/localeTypes"
import { getQueryClient } from "@app/utils/reactQuery/reactQueryHelpers"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { cookies } from "next/headers"

export default async function Page({ params }: { params: Promise<{ lang: Locale; id: string }> }) {
	// --- STATE ---

	const cookieStore = await cookies()
	const authCookieValue = cookieStore.get("auth-cookie")?.value

	const { id } = await params

	const queryClient = getQueryClient()

	await queryClient.prefetchQuery(
		$api.queryOptions("get", "/collection/test/{id}", {
			params: { path: { id: Number(id) } },
			headers: { Cookie: `auth-cookie=${authCookieValue}` },
		}),
	)

	await queryClient.prefetchQuery(
		$api.queryOptions("get", "/collection/{id}/translations", {
			params: { path: { id: Number(id) } },
			headers: { Cookie: `auth-cookie=${authCookieValue}` },
		}),
	)

	// --- RENDER ---

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<CollectionTable />
		</HydrationBoundary>
	)
}
