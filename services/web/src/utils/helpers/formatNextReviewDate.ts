import { TFunction } from "@app/utils/types/tFunction"

export function formatNextReviewDate(nextReviewAt: string, t: TFunction): string {
	const now = new Date()
	const reviewDate = new Date(nextReviewAt)

	// Calculate difference in milliseconds
	const diffMs = reviewDate.getTime() - now.getTime()
	const diffHours = Math.ceil(diffMs / (1000 * 60 * 60))
	const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

	// Overdue
	if (diffMs < 0) {
		return t("common.nextReview.overdue")
	}

	// Less than 24 hours - show in hours
	if (diffHours <= 24) {
		if (diffHours <= 1) {
			return t("common.nextReview.now")
		}
		return t("common.nextReview.inHours", { hours: diffHours })
	}

	// Tomorrow (between 24-48 hours)
	if (diffDays === 1) {
		return t("common.nextReview.tomorrow")
	}

	return t("common.nextReview.inDays", { days: diffDays })
}
