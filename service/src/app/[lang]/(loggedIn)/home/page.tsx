import { PageContent } from "@app/components/ui/pageContent"
import { TranslationForm } from "@app/app/[lang]/(loggedIn)/home/_content/TranslationForm"
import { getQueryClient } from "@app/utils/reactQuery/reactQueryHelpers"
import { $api } from "@app/utils/api/apiRequests"
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

	return (
		<PageContent>
			<TranslationForm />
		</PageContent>
	)
}
