import { Greeting } from "@app/app/[lang]/(loggedIn)/home/_content/greeting"
import { Suspense } from "react"
import { GreetingFallback } from "@app/app/[lang]/(loggedIn)/home/_content/greetingFallback"

export default async function () {
	return (
		<Suspense fallback={<GreetingFallback />}>
			<Greeting />
		</Suspense>
	)
}
