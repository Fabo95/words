import { getTFunction } from "@app/utils/i18n/utils/i18nHelpers"
import { Locale } from "@app/utils/locale/localeTypes"

export default async function Page({ params }: { params: Promise<{ lang: Locale; id: string }> }) {
	// --- STATE ---

	const { lang, id } = await params

	const t = getTFunction(lang)

	// --- RENDER ---

	return "my page"
}
