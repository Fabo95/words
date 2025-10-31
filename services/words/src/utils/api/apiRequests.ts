import { paths } from "services/words/src/generated/openApiTypes"
import { ENV } from "services/words/src/utils/env/env"
import createFetchClient, { Middleware } from "openapi-fetch"
import createClient from "openapi-react-query"

const fetchClient = createFetchClient<paths>({
	credentials: "include",
	baseUrl: ENV.API_BASE_URL,
})

// See: https://openapi-ts.dev/openapi-fetch/middleware-auth#middleware
const middleware: Middleware = {
	async onRequest({ request }) {
		console.log("requuuest", request)

		return request
	},
}

export const $api = createClient(fetchClient)
