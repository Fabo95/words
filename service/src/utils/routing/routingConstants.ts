import { URLPattern } from "next/server"

export const VALID_PATHNAMES = [
	new URLPattern({ pathname: "/:lang/authentication" }),
	new URLPattern({ pathname: "/:lang/home" }),
	new URLPattern({ pathname: "/:lang/account" }),
	new URLPattern({ pathname: "/:lang/collection/:id" }),
]
