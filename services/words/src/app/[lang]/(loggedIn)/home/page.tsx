import { PageContent } from "services/words/src/components/ui/pageContent"
import { getQueryClient } from "services/words/src/utils/reactQuery/reactQueryHelpers"
import { $api } from "services/words/src/utils/api/apiRequests"
import { cookies } from "next/headers"

export default async function () {
	const cookieStore = await cookies()
	const authCookieValue = cookieStore.get("auth-cookie")?.value

	const queryClient = getQueryClient()

	queryClient.prefetchQuery(
		$api.queryOptions("get", "/user/collections", {
			headers: { Cookie: `auth-cookie=${authCookieValue}` },
		}),
	)

	return <PageContent>123</PageContent>
}
