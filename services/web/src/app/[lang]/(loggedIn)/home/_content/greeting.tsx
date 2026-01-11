"use client"

import * as React from "react"
import { useLocale, useTranslations } from "next-intl"
import { Locale } from "@app/utils/locale/localeTypes"
import { $api } from "@app/utils/api/apiRequests"
import { TFunction } from "@app/utils/types/tFunction"

function getGreetingByHour(hour: number, t: TFunction) {
	if (hour < 10) return t("pages.home.greeting.morning")
	if (hour < 14) return t("pages.home.greeting.noon")
	if (hour < 17) return t("pages.home.greeting.afternoon")
	return t("pages.home.greeting.evening")
}

function formatDate(date: Date, locale: Locale) {
	return new Intl.DateTimeFormat(locale, {
		weekday: "long",
		day: "numeric",
		month: "long",
	}).format(date)
}

export function Greeting() {
	const t = useTranslations()

	const [now, setNow] = React.useState<Date>(() => new Date())
	const locale = useLocale()

	const {
		data: { data },
	} = $api.useSuspenseQuery("get", "/user")

	React.useEffect(() => {
		const tick = () => setNow(new Date())

		tick()

		const id = window.setInterval(tick, 60_000)
		return () => window.clearInterval(id)
	}, [])

	const hour = now.getHours()
	const greeting = getGreetingByHour(hour, t)
	const dateText = formatDate(now, locale as Locale)

	return (
		<section className="mb-10">
			<p className="text-center text-sm font-medium text-foreground/40 mb-1">{dateText}</p>

			<h1 className="text-center text-xl font-semibold">
				{greeting}
				{data?.name ? `, ${data.name}` : ""}
			</h1>
		</section>
	)
}
