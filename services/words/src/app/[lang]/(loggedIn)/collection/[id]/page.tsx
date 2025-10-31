import { CollectionTable } from "services/words/src/app/[lang]/(loggedIn)/collection/[id]/_content/collectionTable/collectionTable"
import { PageContent } from "services/words/src/components/ui/pageContent"
import { $api } from "services/words/src/utils/api/apiRequests"
import { Locale } from "services/words/src/utils/locale/localeTypes"
import { getQueryClient } from "services/words/src/utils/reactQuery/reactQueryHelpers"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { cookies } from "next/headers"

export default async function Page({ params }: { params: Promise<{ lang: Locale; id: string }> }) {
	// --- STATE ---

	const cookieStore = await cookies()
	const authCookieValue = cookieStore.get("auth-cookie")?.value

	const { id } = await params

	const queryClient = getQueryClient()

	queryClient.prefetchQuery(
		$api.queryOptions("get", "/collection/test/{id}", {
			params: { path: { id: Number(id) } },
			headers: { Cookie: `auth-cookie=${authCookieValue}` },
		}),
	)

	queryClient.prefetchQuery(
		$api.queryOptions("get", "/collection/{id}/translations", {
			params: { path: { id: Number(id) } },
			headers: { Cookie: `auth-cookie=${authCookieValue}` },
		}),
	)

	// --- RENDER ---

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<PageContent>
				<CollectionTable />
			</PageContent>
		</HydrationBoundary>
	)
}
