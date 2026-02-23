import { paths } from "@app/generated/openApiTypes"
import { ENV } from "@app/utils/env/env"
import createFetchClient, { Middleware } from "openapi-fetch"
import createClient from "openapi-react-query"

// Module-level storage for SSR auth cookie
let ssrAuthCookie: string | undefined

export function setSSRAuthCookie(cookie: string | undefined) {
	ssrAuthCookie = cookie
}

const serverAuthMiddleware: Middleware = {
	async onRequest({ request }) {
		// On server, inject the auth cookie if set
		if (typeof window === "undefined" && ssrAuthCookie && !request.headers.get("Cookie")) {
			request.headers.set("Cookie", `auth-cookie=${ssrAuthCookie}`)
		}
		return request
	},
}

const fetchClient = createFetchClient<paths>({
	credentials: "include",
	baseUrl: ENV.API_BASE_URL,
})

fetchClient.use(serverAuthMiddleware)

export const $api = createClient(fetchClient)
