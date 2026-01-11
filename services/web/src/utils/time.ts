import { TFunction } from "@app/utils/types/tFunction"

export function formatRelativeTime(dateInput: string | Date, t: TFunction, locale = "de") {
	const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput
	const now = new Date()
	const diffMs = now.getTime() - date.getTime()

	if (Number.isNaN(date.getTime())) return ""

	const seconds = Math.floor(diffMs / 1000)
	const minutes = Math.floor(seconds / 60)
	const hours = Math.floor(minutes / 60)
	const days = Math.floor(hours / 24)

	if (seconds < 60) {
		return t("common.relativeTime.justNow")
	}

	if (minutes < 60) {
		return t("common.relativeTime.minutesAgo", { count: minutes })
	}

	if (hours < 24) {
		return t("common.relativeTime.hoursAgo", { count: hours })
	}

	if (days < 7) {
		return t("common.relativeTime.daysAgo", { count: days })
	}

	const formattedDate = new Intl.DateTimeFormat(locale, {
		day: "2-digit",
		month: "short",
	}).format(date)

	return t("common.relativeTime.dateFallback", {
		date: formattedDate,
	})
}
