"use client"

import * as React from "react"
import { useLocale, useTranslations } from "next-intl"
import { Locale } from "@app/utils/locale/localeTypes"
import { TFunction } from "@app/utils/types/tFunction"
import { useSuspenseQuery } from "@tanstack/react-query"
import { getUserQueryOptions } from "@app/utils/reactQuery/queryOptions"

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
	} = useSuspenseQuery(getUserQueryOptions())

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
		<section className="mb-12 md:mb-20">
			<p className="text-center text-xs font-medium text-foreground/40 mb-2">{dateText}</p>

			<h1 className="text-center text-2xl md:text-4xl font-semibold tracking-tight">
				{greeting}
				{data?.name ? `, ${data.name}` : ""}
			</h1>
		</section>
	)
}
