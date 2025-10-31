import { pino } from "pino"

export const logger = pino({
	messageKey: "message",
	// using process.env here to avoid circular dependency
	...(process.env.ENVIRONMENT === "development"
		? {
				transport: {
					target: "pino-pretty",
					options: {
						translateTime: "SYS:dd.mm.yyyy HH:MM:ss",
						colorize: true,
						ignore: "pid,hostname",
					},
				},
			}
		: {}),
	serializers: {
		res(res) {
			const path = res.request?.routeOptions?.url
			return {
				statusCode: res.statusCode,
				url: res.request?.url,
				path: path ? `${res.request.method} ${path}` : `not found`,
			}
		},
		req(req) {
			const path = req.routeOptions?.url

			return {
				method: req.method,
				url: req.url,
				path: path ? `${req.method} ${path}` : "not found",
				parameters: req.parameters,
				headers: {
					acceptLanguage: req.headers["accept-language"],
					"x-app-version": req.headers["x-app-version"],
				},
			}
		},
	},
})
